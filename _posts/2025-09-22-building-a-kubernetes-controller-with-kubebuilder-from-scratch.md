---
layout: post
title: Building a Kubernetes Controller with Kubebuilder from Scratch
date: 2025-09-22 10:30:00
description : In this tutorial, you will learn how to build a custom Kubernetes controller (also known as an Operator) using Kubebuilder. We will create a Custom Resource Definition (CRD) for a simple Website resource.
tags: kubernetes controller Kubebuilder crd opensource
categories: tutorial
---

In this tutorial, you will learn how to build a custom Kubernetes controller (also known as an Operator) using Kubebuilder. We will create a Custom Resource Definition (CRD) for a simple `Website` resource. The goal of our controller will be to watch for these `Website` resources and, for each one, create a corresponding Kubernetes `Deployment` and `Service`.

This is a powerful pattern that allows you to extend the Kubernetes API to manage your own applications declaratively.

#### **What We Are Building**

We will define a `Website` custom resource that looks like this:

```yaml
# config/samples/website_v1alpha1_website.yaml
apiVersion: website.my.domain/v1alpha1
kind: Website
metadata:
  name: my-first-website
spec:
  # The git repository URL containing the website's static files
  gitRepo: "https://github.com/someuser/my-static-site.git"
  # The number of replicas for the web server
  replicas: 3
```

Our controller will see this resource and automatically create:
1.  A `Deployment` to run an Nginx server with the specified number of `replicas`. We'll imagine it serves content from the `gitRepo`.
2.  A `Service` of type `LoadBalancer` to expose the Nginx pods to the internet.

---

### **Prerequisites**

Before you begin, make sure you have the following tools installed:

1.  **Go** (version 1.19+): [https://golang.org/dl/](https://golang.org/dl/)
2.  **Docker**: To build container images.
3.  **`kubectl`**: The Kubernetes command-line tool.
4.  **A Kubernetes Cluster**: A local one like [Minikube](https://minikube.sigs.k8s.io/docs/start/) or [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) is perfect for development.
5.  **Kubebuilder**: The scaffolding tool.
    ```bash
    # Install Kubebuilder
    os=$(go env GOOS)
    arch=$(go env GOARCH)
    curl -L -o kubebuilder "https://go.kubebuilder.io/dl/latest/${os}/${arch}"
    sudo mv kubebuilder /usr/local/bin/
    ```

---

### **Step 1: Initialize Your Project**

First, create a new directory for your project and initialize it with Kubebuilder.

```bash
# Create and enter the project directory
mkdir website-operator
cd website-operator

# Initialize the project
# --domain is used for the API group of your CRDs
# --repo is your Go module path (e.g., github.com/your-user/website-operator)
kubebuilder init --domain my.domain --repo github.com/your-user/website-operator
```

This command scaffolds a complete project structure, including a `Makefile`, a `main.go` file, and a `Dockerfile`.

### **Step 2: Create the API (CRD and Controller)**

Now, let's create the API for our `Website` resource. This single command will generate the CRD definition, the Go struct for our resource, and a skeleton for our controller.

```bash
# Create the API. We'll create the resource and the controller.
kubebuilder create api --group website --version v1alpha1 --kind Website
```
When prompted, answer `y` to create both the Resource and the Controller.

This command does several important things:
*   **`api/v1alpha1/website_types.go`**: This file defines the Go structs that represent your `Website` resource. This is where you define your `Spec` (the desired state) and `Status` (the observed state).
*   **`controllers/website_controller.go`**: This is the skeleton for your controller's logic.
*   **`config/crd/bases/website.my.domain_websites.yaml`**: The YAML definition for your CRD.

#### **Defining the `Spec` and `Status`**

Open `api/v1alpha1/website_types.go`. We need to define the fields for our resource.

Find the `WebsiteSpec` and `WebsiteStatus` structs and modify them as follows.

```go
// api/v1alpha1/website_types.go

// ... (other imports)

// WebsiteSpec defines the desired state of Website
type WebsiteSpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	// GitRepo is the git repository URL for the website's content.
	// +kubebuilder:validation:Required
	GitRepo string `json:"gitRepo"`

	// Replicas is the number of desired pods. Defaults to 1.
	// +kubebuilder:validation:Minimum=1
	// +kubebuilder:default=1
	// +optional
	Replicas *int32 `json:"replicas"`
}

// WebsiteStatus defines the observed state of Website
type WebsiteStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	// DeploymentStatus reflects the status of the created Deployment.
	// +optional
	DeploymentStatus appsv1.DeploymentStatus `json:"deploymentStatus,omitempty"`

	// ServiceStatus reflects the status of the created Service.
	// +optional
	ServiceStatus v1.ServiceStatus `json:"serviceStatus,omitempty"`
}
// ... (rest of the file)
```
*   **`WebsiteSpec`**: We added `GitRepo` (a required string) and `Replicas` (an optional integer with a minimum value of 1). The `//+kubebuilder` comments are "markers" that generate validation rules in the CRD.
*   **`WebsiteStatus`**: We will use this to report the status of the `Deployment` and `Service` we create. You'll need to add the `appsv1` and `v1` imports from `k8s.io/api`.

After modifying the `_types.go` file, **always run `make`** to regenerate the deepcopy functions and CRD manifests.

```bash
make
```

### **Step 3: Implement the Controller Logic**

This is the most important part. The controller's job is to read the state of a `Website` resource and take action to make the real world (the cluster state) match the desired state in the `Spec`.

Open `internal/controllers/website_controller.go`. The core logic goes inside the `Reconcile` function.

#### **The Reconciliation Loop**

The `Reconcile` function is called every time a `Website` resource is created, updated, or deleted. Its goal is to reach a steady state. It's like a thermostat: it checks the temperature (current state) and turns the heating on or off (takes action) to reach the desired temperature (desired state).

Let's implement the logic.

1.  **Get the `Website` resource**: The request contains the name and namespace of the resource that triggered the reconciliation.
2.  **Check if Deployment exists**: If not, create it.
3.  **If Deployment exists**: Ensure its spec (e.g., number of replicas) matches the `Website` spec. If not, update it.
4.  **Check if Service exists**: If not, create it.
5.  **Update Status**: Report the current status back to the `Website` resource.

#### **Updating the Controller Code**

Replace the contents of `internal/controllers/website_controller.go` with the following code. Read the comments carefully to understand each step.

{% raw %}
```go
// internal/controllers/website_controller.go

package controllers

import (
	"context"
	"reflect"

	appsv1 "k8s.ioio/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	websitev1alpha1 "github.com/your-user/website-operator/api/v1alpha1"
)

// WebsiteReconciler reconciles a Website object
type WebsiteReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=website.my.domain,resources=websites,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=website.my.domain,resources=websites/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=website.my.domain,resources=websites/finalizers,verbs=update
//+kubebuilder:rbac:groups=apps,resources=deployments,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=services,verbs=get;list;watch;create;update;patch;delete

func (r *WebsiteReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	logger := log.FromContext(ctx)

	// 1. Fetch the Website instance
	website := &websitev1alpha1.Website{}
	err := r.Get(ctx, req.NamespacedName, website)
	if err != nil {
		if errors.IsNotFound(err) {
			logger.Info("Website resource not found. Ignoring since object must be deleted.")
			return ctrl.Result{}, nil
		}
		logger.Error(err, "Failed to get Website")
		return ctrl.Result{}, err
	}

	// 2. Reconcile the Deployment
	deployment := &appsv1.Deployment{}
	err = r.Get(ctx, types.NamespacedName{Name: website.Name, Namespace: website.Namespace}, deployment)

	// If the deployment does not exist, create it. Otherwise, update it.
	if err != nil && errors.IsNotFound(err) {
		// Define a new deployment
		dep := r.deploymentForWebsite(website)
		logger.Info("Creating a new Deployment", "Deployment.Namespace", dep.Namespace, "Deployment.Name", dep.Name)
		err = r.Create(ctx, dep)
		if err != nil {
			logger.Error(err, "Failed to create new Deployment", "Deployment.Namespace", dep.Namespace, "Deployment.Name", dep.Name)
			return ctrl.Result{}, err
		}
		// Deployment created successfully - return and requeue
		return ctrl.Result{Requeue: true}, nil
	} else if err != nil {
		logger.Error(err, "Failed to get Deployment")
		return ctrl.Result{}, err
	}

	// Ensure the deployment size is the same as the spec
	size := website.Spec.Replicas
	if *deployment.Spec.Replicas != *size {
		deployment.Spec.Replicas = size
		err = r.Update(ctx, deployment)
		if err != nil {
			logger.Error(err, "Failed to update Deployment", "Deployment.Namespace", deployment.Namespace, "Deployment.Name", deployment.Name)
			return ctrl.Result{}, err
		}
		// Ask to requeue after 1 minute in order to give time for the
		// pods be created
		return ctrl.Result{RequeueAfter: time.Minute}, nil
	}

	// 3. Reconcile the Service
	service := &corev1.Service{}
	err = r.Get(ctx, types.NamespacedName{Name: website.Name, Namespace: website.Namespace}, service)
	if err != nil && errors.IsNotFound(err) {
		// Define a new service
		svc := r.serviceForWebsite(website)
		logger.Info("Creating a new Service", "Service.Namespace", svc.Namespace, "Service.Name", svc.Name)
		err = r.Create(ctx, svc)
		if err != nil {
			logger.Error(err, "Failed to create new Service", "Service.Namespace", svc.Namespace, "Service.Name", svc.Name)
			return ctrl.Result{}, err
		}
		return ctrl.Result{Requeue: true}, nil
	} else if err != nil {
		logger.Error(err, "Failed to get Service")
		return ctrl.Result{}, err
	}
	
	// 4. Update the Website status
	// We'll just reflect the deployment status for simplicity
	if !reflect.DeepEqual(deployment.Status, website.Status.DeploymentStatus) {
		website.Status.DeploymentStatus = deployment.Status
		err := r.Status().Update(ctx, website)
		if err != nil {
			logger.Error(err, "Failed to update Website status")
			return ctrl.Result{}, err
		}
	}

	return ctrl.Result{}, nil
}

// deploymentForWebsite returns a Website Deployment object
func (r *WebsiteReconciler) deploymentForWebsite(w *websitev1alpha1.Website) *appsv1.Deployment {
	labels := map[string]string{"app": w.Name}
	replicas := w.Spec.Replicas

	// For a real-world controller, you would likely use an initContainer
	// to clone the gitRepo into a volume. For this tutorial, we'll use
	// a simple nginx image.
	dep := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      w.Name,
			Namespace: w.Namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{{
						Image: "nginx:1.14.2",
						Name:  "web-server",
						Ports: []corev1.ContainerPort{{
							ContainerPort: 80,
							Name:          "http",
						}},
					}},
				},
			},
		},
	}

	// Set Website instance as the owner and controller
	ctrl.SetControllerReference(w, dep, r.Scheme)
	return dep
}

// serviceForWebsite returns a Website Service object
func (r *WebsiteReconciler) serviceForWebsite(w *websitev1alpha1.Website) *corev1.Service {
	labels := map[string]string{"app": w.Name}

	svc := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      w.Name,
			Namespace: w.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: labels,
			Ports: []corev1.ServicePort{{
				Protocol:   corev1.ProtocolTCP,
				Port:       80,
				TargetPort: intstr.FromString("http"),
			}},
			Type: corev1.ServiceTypeLoadBalancer,
		},
	}
	// Set Website instance as the owner and controller
	ctrl.SetControllerReference(w, svc, r.Scheme)
	return svc
}

// SetupWithManager sets up the controller with the Manager.
func (r *WebsiteReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&websitev1alpha1.Website{}).
		Owns(&appsv1.Deployment{}).
		Owns(&corev1.Service{}).
		Complete(r)
}
```
{% endraw %}

**Key changes and explanations:**

*   **RBAC Permissions (`//+kubebuilder:rbac`):** We added permissions for the controller to manage `Deployments` and `Services`. After adding these, run `make manifests` to update the RBAC roles in `config/rbac/role.yaml`.
*   **`deploymentForWebsite` & `serviceForWebsite`:** These helper functions create the desired Deployment and Service objects.
*   **`ctrl.SetControllerReference`**: **This is crucial.** It sets the `Website` resource as the "owner" of the Deployment and Service. This means when you delete the `Website` resource, Kubernetes garbage collection will automatically delete the owned Deployment and Service.
*   **`SetupWithManager`**: We configured the controller to `Own` Deployments and Services. This tells the controller-runtime framework to trigger a reconciliation for a `Website` resource whenever its owned `Deployment` or `Service` is changed or deleted.

### **Step 4: Run and Test the Controller**

Now for the exciting part! Let's run our controller and see it in action.

#### **1. Install the CRD into the Cluster**

The cluster needs to know about the `Website` resource type.

```bash
make install
```

Verify that the CRD is installed:
```bash
kubectl get crd websites.website.my.domain
# NAME                          CREATED AT
# websites.website.my.domain    2023-10-27T10:30:00Z
```

#### **2. Run the Controller Locally**

Running the controller on your local machine is fantastic for development and debugging. It will use your local kubeconfig to talk to the cluster.

```bash
make run
```
You will see logs from the controller manager starting up. It is now waiting for `Website` resources to be created.

#### **3. Create a `Website` Resource**

In a **new terminal**, apply the sample `Website` resource. Kubebuilder has already created a sample for you in `config/samples/website_v1alpha1_website.yaml`. Let's modify it to match our `Spec`.

```yaml
# config/samples/website_v1alpha1_website.yaml
apiVersion: website.my.domain/v1alpha1
kind: Website
metadata:
  labels:
    app.kubernetes.io/name: website
    app.kubernetes.io/instance: website-sample
    app.kubernetes.io/part-of: website-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: website-operator
  name: website-sample
spec:
  gitRepo: "https://github.com/my-user/my-repo.git"
  replicas: 2
```

Apply it:
```bash
kubectl apply -f config/samples/website_v1alpha1_website.yaml
```

#### **4. Observe the Results**

Look at the logs from your `make run` terminal. You should see the controller creating the Deployment and Service.

Now, check the resources in your cluster:

```bash
# Check our custom resource
kubectl get website

# NAME             AGE
# website-sample   15s

# Check the Deployment created by our controller
kubectl get deployment website-sample

# NAME             READY   UP-TO-DATE   AVAILABLE   AGE
# website-sample   2/2     2            2           12s

# Check the Service created by our controller
kubectl get service website-sample

# NAME             TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
# website-sample   LoadBalancer   10.10.10.10    <pending>     80:31234/TCP   10s
```
Success! Our controller saw the `Website` resource and created the corresponding Deployment and Service.

Now, try changing the number of replicas in the YAML file to `3` and `kubectl apply` it again. You will see the controller update the Deployment to match.

#### **5. Cleanup**
Delete the `Website` resource. Because we set the Owner Reference, the Deployment and Service will be automatically deleted too.
```bash
kubectl delete -f config/samples/website_v1alpha1_website.yaml

# Verify they are gone
kubectl get deployment,service
```

---

### **Step 5: Build and Deploy to the Cluster**

Running locally is great for development, but for production, you need to run the controller as a `Deployment` inside the cluster.

1.  **Build and Push the Docker Image**:
    (Replace `your-dockerhub-username` with your actual username)
    ```bash
    make docker-build IMG=your-dockerhub-username/website-operator:v0.0.1
    make docker-push IMG=your-dockerhub-username/website-operator:v0.0.1
    ```

2.  **Deploy the Controller to the Cluster**:
    This command will use the manifests in the `config` directory to create the `Deployment`, `RBAC` roles, and everything else needed to run the controller.
    ```bash
    make deploy IMG=your-dockerhub-username/website-operator:v0.0.1
    ```
Your controller is now running inside the cluster, just like any other application. It will continue to watch for `Website` resources and reconcile them.

### **Conclusion and Next Steps**

Congratulations! You have successfully built a fully functional Kubernetes controller. You learned how to:
*   Scaffold a project with Kubebuilder.
*   Define a Custom Resource Definition (`CRD`).
*   Implement the reconciliation logic in a controller.
*   Set owner references for garbage collection.
*   Run, test, and deploy your controller.

From here, you can explore more advanced topics:
*   **Finalizers**: To perform cleanup actions before a resource is deleted.
*   **Webhooks**: To validate or mutate your custom resources on creation/update.
*   **More Complex Status Updates**: Provide richer status information about the resources your controller manages.
*   **Testing**: Write unit and integration tests for your controller logic.