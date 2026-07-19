---
aliases: ["/blog/2025/guide-building-custom-kubernetes-scheduler/"]
title: "Guide to Building a Custom Kubernetes Scheduler"
date: "2025-08-24 17:30:00"
description: "Here is a complete, A-to-Z guide in English to develop and deploy your own Kubernetes scheduler using the Scheduling Framework. This guide is practical, detailed, and follows a step-by-step approach from concept to a working deployment in a kubeadm cluster."
tags: ["kubernetes", "scheduler", "kubeadm", "plugin", "opensource"]
categories: ["tutorial"]
---

This guide will walk you through creating a custom scheduler plugin that influences where pods are placed based on custom logic. We will build a simple "Network-Aware" plugin that prefers to schedule pods on nodes with a specific network label.

**What We Will Build:**
*   **A `Filter` plugin:** It will only allow pods that request `high-speed` networking to be scheduled on nodes that are labeled as `network-topology=high-speed`.
*   **A `Score` plugin:** It will give a higher score to nodes with the `high-speed` label, making them more desirable.
*   We will then package this plugin into a new scheduler binary, containerize it, and deploy it to a local Kubernetes cluster.

---

### **Part 1: Understanding the Foundations - The Scheduling Framework**

Before writing any code, it's crucial to understand the "why" and "how".

#### What is the Kubernetes Scheduler?

The default Kubernetes scheduler (`kube-scheduler`) is a control plane component that watches for newly created Pods that have no `nodeName` assigned. For every Pod it discovers, the scheduler becomes responsible for finding the best Node for that Pod to run on. This process involves two main phases:

1.  **Filtering (Predicates):** The scheduler finds the set of feasible Nodes where the Pod *can* run. For example, if a Pod requests 2 CPUs, all nodes with less than 2 available CPUs are filtered out.
2.  **Scoring (Priorities):** From the list of feasible nodes, the scheduler ranks each node by assigning it a score. It then picks the node with the highest score. For example, it might prefer a node that has fewer running pods.

#### The Scheduling Framework: Your Entry Point

The Scheduling Framework is a pluggable architecture for the `kube-scheduler` that makes it easy to add custom logic without forking the entire Kubernetes codebase. It exposes a set of **Extension Points** in the scheduling lifecycle where your custom code (a **Plugin**) can be executed.

**Visualizing the Extension Points:**

Here is the flow of the scheduling process and where the main extension points fit in.

```
                  (A Pod is created without a node)
                                  |
                                  v
+-------------------------------------------------------------------------+
|                        SCHEDULING CYCLE (for one Pod)                     |
+-------------------------------------------------------------------------+
                                  |
                                  v
[ QueueSort ] <--- Your plugin can sort pods in the scheduling queue.
                                  |
                                  v
+-------------------------------------------------------------------------+
|                      SCHEDULING ATTEMPT (for one Pod)                     |
+-------------------------------------------------------------------------+
|                                 |                                       |
|                                 v                                       |
| [ PreFilter ] <--- Pre-process info about the Pod before filtering.     |
|                                 |                                       |
|          --------------------- FOR EACH NODE ----------------------     |
|          |                                                        |     |
|          |    [ Filter ] <--- Can this Pod run on this Node? (Yes/No) |   |
|          |          (If No, Node is discarded for this Pod)        |     |
|          |                                                        |     |
|          ----------------------------------------------------------     |
|                                 |                                       |
|                                 v                                       |
| [ PostFilter ] <- If no nodes are viable, your plugin can take action.  |
|                                 |                                       |
|                                 v                                       |
| [ PreScore ] <--- Pre-process info before scoring viable nodes.         |
|                                 |                                       |
|          --------------------- FOR EACH VIABLE NODE ---------------     |
|          |                                                        |     |
|          |    [ Score ] <--- Give this Node a score (e.g., 0-100).  |   |
|          |                                                        |     |
|          ----------------------------------------------------------     |
|                                 |                                       |
|                                 v                                       |
| [ NormalizeScore ] <- Modify all scores to fit a common scale.          |
|                                 |                                       |
|                                 v                                       |
|                          (Scheduler picks Node with highest score)        |
|                                 |                                       |
|                                 v                                       |
+-------------------------------------------------------------------------+
|                           BINDING CYCLE                                 |
+-------------------------------------------------------------------------+
|                                 |                                       |
|                                 v                                       |
| [ Reserve ] <--- Mark resources as "reserved" on the chosen node.       |
|                                 |                                       |
|                                 v                                       |
| [ Permit ] <--- Approve or deny the binding. Can delay binding.         |
|                                 |                                       |
|                                 v                                       |
| [ PreBind ] <--- Actions to take right before the Pod is bound.         |
|                                 |                                       |
|                                 v                                       |
| [ Bind ] <--- The actual binding of the Pod to the Node.                |
|                                 |                                       |
|                                 v                                       |
| [ PostBind ] <--- Actions to take after the binding is successful.      |
|                                 |                                       |
+-------------------------------------------------------------------------+
```

Our plugin will focus on the **`Filter`** and **`Score`** extension points.


---

### **Part 2: Setting Up the Professional Development Environment**

This is where we align with the project's standards.

#### Prerequisites:

1.  **Go:** Version 1.19+ (the `scheduler-plugins` project specifies its version in the `go.mod` file).
2.  **Docker:** To build container images. Make sure the Docker daemon is running.
3.  **kubectl:** The Kubernetes command-line tool.
4.  **`kind`**: Our local Kubernetes cluster.

#### Step 1: Clone the `scheduler-plugins` Repository

We will use the official repository not just as a template, but as our direct development environment. This is the standard practice.

```bash
git clone https://github.com/kubernetes-sigs/scheduler-plugins.git
cd scheduler-plugins
```

#### Step 2: Explore the `Makefile`

The `Makefile` in this repository is the heart of the development workflow. Instead of running raw `go` or `docker` commands, we will use `make` targets. This ensures consistency and correctness.

Key targets we will use:
*   `make verify`: Runs formatters and linters to ensure code quality. **Always run this before committing.**
*   `make unit-test`: Runs all unit tests in the repository.
*   `make local-image`: **This is crucial.** It builds a scheduler container image for your local architecture, gives it a standard local name (`localhost:5000/...`), and loads it directly into your local Docker daemon. Perfect for testing with `kind`.
*   `make build`: Compiles the Go binaries (`kube-scheduler` and `controller`) into the `/bin` directory.

---

### **Part 3: Developing Our Custom Plugin**

The core logic remains the same, but the process around it will be more rigorous.

#### Step 1: Create the Plugin Directory and File

```bash
mkdir -p pkg/networkspeed
touch pkg/networkspeed/networkspeed.go
```

#### Step 2: Write the Plugin Code

Place the same Go code from the previous guide into `pkg/networkspeed/networkspeed.go`. This code implements the `Filter` and `Score` extension points.


```go
// pkg/networkspeed/networkspeed.go

package networkspeed

import (
	"context"
	"fmt"

	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/klog/v2"
	"k8s.io/kubernetes/pkg/scheduler/framework"
)

// Define plugin name
const Name = "Networkspeed"

const (
	// Annotation key on a Pod to specify network preference.
	PodNetworkAnnotation = "my-network-preference"
	// Label key on a Node to specify the type of network it has.
	NodeNetworkLabel = "network-topology"
	// Value for high-speed network preference.
	HighSpeedNetwork = "high-speed"
)

// Networkspeed is a plugin that filters and scores nodes based on network labels.
type Networkspeed struct {
	handle framework.Handle
}

// Ensure our plugin implements the necessary interfaces.
var _ framework.FilterPlugin = &Networkspeed{}
var _ framework.ScorePlugin = &Networkspeed{}

// Name returns the name of the plugin.
func (na *Networkspeed) Name() string {
	return Name
}

// New is the factory function that creates a new instance of the plugin.
// This is called by the scheduler framework when it initializes.
func  New(_ context.Context, obj runtime.Object, handle framework.Handle) (framework.Plugin, error) {
	klog.V(3).Infof("Creating new Networkspeed plugin")
	return &Networkspeed{
		handle: handle,
	}, nil
}

// ----------------- FILTERING LOGIC -----------------

// Filter is called by the framework for each node to see if the pod can be scheduled on it.
func (na *Networkspeed) Filter(ctx context.Context, state *framework.CycleState, pod *v1.Pod, nodeInfo *framework.NodeInfo) *framework.Status {
	klog.V(3).Infof("Filtering pod %v for node %v", pod.Name, nodeInfo.Node().Name)

	// 1. Get the pod's network preference from its annotations.
	podNetworkPreference, ok := pod.Annotations[PodNetworkAnnotation]
	if !ok {
		// If the pod doesn't have the annotation, it has no special network needs.
		// So, it can run on any node. We allow it.
		return framework.NewStatus(framework.Success, "")
	}

	// 2. If the pod requests a high-speed network...
	if podNetworkPreference == HighSpeedNetwork {
		// ...check if the node has the required label.
		nodeLabels := nodeInfo.Node().GetLabels()
		nodeNetworkType, labelExists := nodeLabels[NodeNetworkLabel]

		if labelExists && nodeNetworkType == HighSpeedNetwork {
			// The node has the required label. The pod can run here.
			klog.V(3).Infof("Node %v has the required '%s' label. Allowing pod %v.", nodeInfo.Node().Name, HighSpeedNetwork, pod.Name)
			return framework.NewStatus(framework.Success, "")
		} else {
			// The node does not have the label. The pod cannot run here.
			klog.V(3).Infof("Node %v does not have the required '%s' label. Filtering out.", nodeInfo.Node().Name, HighSpeedNetwork)
			return framework.NewStatus(framework.Unschedulable, fmt.Sprintf("Node %s lacks required network label", nodeInfo.Node().Name))
		}
	}

	// For any other annotation value, we don't apply any special filtering.
	return framework.NewStatus(framework.Success, "")
}


// ----------------- SCORING LOGIC -----------------

// Score is called for each node that passed the Filter phase.
// It returns a score for the node, with higher scores being better.
func (na *Networkspeed) Score(ctx context.Context, state *framework.CycleState, pod *v1.Pod, nodeName string) (int64, *framework.Status) {
	klog.V(3).Infof("Scoring node %v for pod %v", nodeName, pod.Name)

	nodeInfo, err := na.handle.SnapshotSharedLister().NodeInfos().Get(nodeName)
	if err != nil {
		return 0, framework.AsStatus(fmt.Errorf("getting node %s from snapshot: %w", nodeName, err))
	}

	nodeLabels := nodeInfo.Node().GetLabels()
	podNetworkPreference, ok := pod.Annotations[PodNetworkAnnotation]

	// If the pod wants a high-speed network and the node has it, give it the highest score.
	if ok && podNetworkPreference == HighSpeedNetwork {
		if nodeNetworkType, labelExists := nodeLabels[NodeNetworkLabel]; labelExists && nodeNetworkType == HighSpeedNetwork {
			klog.V(3).Infof("Node %v matches high-speed preference. Giving max score (100).", nodeName)
			return 100, framework.NewStatus(framework.Success, "")
		}
	}

	// For all other cases, give a minimal score. The scheduler will still use other plugins
	// (like least-allocated) to make a final decision.
	klog.V(3).Infof("Node %v does not match high-speed preference. Giving min score (10).", nodeName)
	return 10, framework.NewStatus(framework.Success, "")
}

// ScoreExtensions returns a ScoreExtensions interface if the plugin implements one.
func (na *Networkspeed) ScoreExtensions() framework.ScoreExtensions {
	// We don't need to normalize scores, so we return nil.
	return nil
}
```

#### Step 3: Register the Plugin

This step is also the same. We must tell the main binary about our new plugin.

Edit `cmd/scheduler/main.go` and add our plugin to the registry.

```go
// cmd/scheduler/main.go

import (
    // ... other imports
	"k8s.io/component-base/cli"
	"k8s.io/kubernetes/cmd/kube-scheduler/app"

    // IMPORT YOUR PLUGIN'S PACKAGE
	"sigs.k8s.io/scheduler-plugins/pkg/networkspeed"
    
	// ... other plugin imports
)

func main() {
	// Register all plugins.
	command := app.NewSchedulerCommand(
		app.WithPlugin(networkspeed.Name, networkspeed.New), // <-- ADD THIS LINE
		app.WithPlugin(coscheduling.Name, coscheduling.New),
		// ... other plugins
	)
    // ...
}
```

---

### **Part 4: Verifying, Building, and Packaging**

This section is completely revamped to use the official `Makefile`.

#### Step 1: Verify Your Code Quality

Before you even think about building, run the verification scripts. This catches formatting errors, dependency issues, and other common problems.

```bash
make verify
```
If this command fails, fix the issues it reports (e.g., run `go fmt ./...`) and try again. This is a standard prerequisite for contributing to open-source projects.

#### Step 2: Build the Local Container Image

This is the most significant improvement. Forget manually setting registry and image names. The `local-image` target is designed specifically for this workflow.

```bash
make local-image
```

**What does this command do?**
1.  It compiles your Go code, including the new `networkspeed` plugin, into a `kube-scheduler` binary.
2.  It builds a container image using Docker.
3.  It automatically sets the platform to your local machine's architecture (e.g., `linux/amd64` or `linux/arm64`).
4.  It tags the image with a convenient name for local development: `localhost:5000/scheduler-plugins/kube-scheduler:v0.0.0`.
5.  It uses the `--load` flag with `docker buildx` to ensure the final image is available in your local Docker daemon, ready for `kind` to use.

After it finishes, you can confirm the image exists:
```bash
docker images | grep scheduler-plugins
```
You should see `localhost:5000/scheduler-plugins/kube-scheduler`.

---

### **Part 5 : Production-Grade Deployment on VMs**

We will provision two Virtual Machines (one control-plane, one worker) and bootstrap a Kubernetes cluster using the `kubeadm` tool.

#### Prerequisites for this Section:

*   **VirtualBox and Vagrant:** For easily provisioning and managing local VMs.
*   **Sufficient System Resources:** At least 4 CPUs and 8GB of RAM available for the VMs.

#### Step 1: Provision the Virtual Machines

We'll use a `Vagrantfile` to define our two-node cluster. Create a file named `Vagrantfile` with the following content:

```ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.provider "virtualbox" do |v|
    v.memory = 4096
    v.cpus = 2
  end

  config.vm.define "k8s-control-plane" do |control|
    control.vm.hostname = "k8s-control-plane"
    control.vm.network "private_network", ip: "192.168.56.10"
  end

  config.vm.define "k8s-worker-01" do |worker|
    worker.vm.hostname = "k8s-worker-01"
    worker.vm.network "private_network", ip: "192.168.56.11"
  end
end
```

Now, bring up the machines:
```bash
vagrant up
```

#### Step 2: Install Container Runtime and Kubernetes Tools on Both VMs

Execute these commands on **both** the `k8s-control-plane` and `k8s-worker-01` VMs. You can connect using `vagrant ssh k8s-control-plane` and `vagrant ssh k8s-worker-01`.

```bash
# SSH into each VM and run the following:

# 1. Install prerequisites and containerd
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y containerd.io

# 2. Configure containerd and enable required kernel modules
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sudo sysctl --system
sudo systemctl restart containerd

# 3. Disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# 4. Install kubeadm, kubelet, and kubectl
sudo apt-get update
curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

#### Step 3: Initialize the Control-Plane Node

Run this command **only on the `k8s-control-plane` VM**:

```bash
# On k8s-control-plane
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=192.168.56.10
```
This command will take a few minutes. At the end, it will output two important things:
1.  Commands to set up `kubectl` for the `vagrant` user.
2.  A `kubeadm join` command with a token. **Copy this join command and save it.**

Run the `kubectl` setup commands on the control-plane node:
```bash
# On k8s-control-plane
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

#### Step 4: Install a CNI Network Plugin

The cluster nodes will not be `Ready` until a CNI is installed. From the control-plane node, install Calico:
```bash
# On k8s-control-plane
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

#### Step 5: Join the Worker Node

Now, SSH into the `k8s-worker-01` VM and run the `kubeadm join` command that you saved from Step 3. It will look something like this (your token and hash will be different):
```bash
# On k8s-worker-01
sudo kubeadm join 192.168.56.10:6443 --token abcdef.1234567890abcdef \
	--discovery-token-ca-cert-hash sha256:1234...cdef
```

After a minute, verify that both nodes are `Ready` from the control-plane node:
```bash
# On k8s-control-plane
kubectl get nodes
```

#### Step 6: Provision the Static Configuration on the Control-Plane

This is the critical step. We must place our custom scheduler's configuration file at the exact path `/etc/kubernetes/config/scheduler-config.yaml` on the `k8s-control-plane` VM.

```bash
# Run this from your local machine (not inside a VM)
vagrant ssh k8s-control-plane -- -t '
  sudo mkdir -p /etc/kubernetes/config && \
  sudo bash -c "cat > /etc/kubernetes/config/scheduler-config.yaml" <<EOF
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
leaderElection:
  leaderElect: false
clientConnection:
  kubeconfig: "/etc/kubernetes/scheduler.conf"
profiles:
  - schedulerName: my-custom-scheduler
    plugins:
      multiPoint:
        enabled:
          - name: "Networkspeed"
EOF'

# Verify the file was created correctly
vagrant ssh k8s-control-plane -- "sudo cat /etc/kubernetes/config/scheduler-config.yaml"
```

#### Step 7: Load the Custom Scheduler Image onto the Cluster Nodes

The container image we built exists only on our local machine. We need to transfer it to our VMs.

```bash
# 1. On your local machine, save the Docker image to a tar file
docker save localhost:5000/scheduler-plugins/kube-scheduler:v0.0.0 > scheduler.tar

# 2. Copy the tar file to both VMs
vagrant scp scheduler.tar k8s-control-plane:/home/vagrant/scheduler.tar
vagrant scp scheduler.tar k8s-worker-01:/home/vagrant/scheduler.tar

# 3. SSH into EACH VM and load the image into containerd
# On k8s-control-plane:
vagrant ssh k8s-control-plane -- "sudo ctr -n=k8s.io images import /home/vagrant/scheduler.tar"
# On k8s-worker-01:
vagrant ssh k8s-worker-01 -- "sudo ctr -n=k8s.io images import /home/vagrant/scheduler.tar"
```

#### Step 8: Deploy the Custom Scheduler

Create the final `deploy-kubeadm.yaml` manifest on your local machine. This file is identical to the previous "correct" version, as it's designed to run in a real cluster environment.

`deploy-kubeadm.yaml`:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-custom-scheduler
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-custom-scheduler-as-kube-scheduler
subjects:
- kind: ServiceAccount
  name: my-custom-scheduler
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: system:kube-scheduler
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-custom-scheduler
  namespace: kube-system
  labels:
    app: my-custom-scheduler
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-custom-scheduler
  template:
    metadata:
      labels:
        app: my-custom-scheduler
    spec:
      serviceAccountName: my-custom-scheduler
      nodeSelector:
        node-role.kubernetes.io/control-plane: "true"
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/control-plane
      containers:
        - name: my-custom-scheduler-ctr
          image: localhost:5000/scheduler-plugins/kube-scheduler:v0.0.0
          imagePullPolicy: IfNotPresent
          args:
            - /bin/kube-scheduler
            - --authentication-kubeconfig=/etc/kubernetes/scheduler.conf
            - --authorization-kubeconfig=/etc/kubernetes/scheduler.conf
            - --config=/etc/kubernetes/config/scheduler-config.yaml
            - -v=3
          volumeMounts:
          - mountPath: /etc/kubernetes
            name: etckubernetes
            readOnly: true
      volumes:
      - name: etckubernetes
        hostPath:
          path: /etc/kubernetes
          type: Directory
```

Now, apply this manifest to your new `kubeadm` cluster. You can copy this file to the control-plane node or configure `kubectl` on your host to point to the new cluster. The simplest is to run it from the control-plane:
```bash
# Copy the YAML to the control plane
vagrant scp deploy-kubeadm.yaml k8s-control-plane:/home/vagrant/

# Apply it from within the control plane VM
vagrant ssh k8s-control-plane -- "kubectl apply -f deploy-kubeadm.yaml"
```

Verify the scheduler pod is running on the control-plane node:
```bash
vagrant ssh k8s-control-plane -- "kubectl get pods -n kube-system -l app=my-custom-scheduler -o wide"
```

---

### **Part 6: Testing the Custom Scheduler**

The testing process is identical, but you will run the commands from your `k8s-control-plane` VM where `kubectl` is configured.

1.  **Label the worker node:**
    ```bash
        # On k8s-control-plane VM
        kubectl label node k8s-worker-01 network-topology=high-speed
    ```
2.  **Create and apply `test-pod.yaml`:**
    ```yaml
        # test-pod.yaml
        apiVersion: v1
        kind: Pod
        metadata:
        name: high-speed-pod
        annotations:
            my-network-preference: "high-speed"
        spec:
        schedulerName: my-custom-scheduler
        containers:
        - name: nginx
            image: nginx
    ```
    ```bash
    # On k8s-control-plane VM, apply the pod
    kubectl apply -f test-pod.yaml
    ```
3.  **Verify the pod placement:**
    ```bash
    # On k8s-control-plane VM
    kubectl get pod high-speed-pod -o wide
    ```
    The pod should be running on the `k8s-worker-01` node.

You have now successfully built a custom scheduler and deployed it to a realistic, multi-node `kubeadm` cluster.

**Your Professional Next Steps:**

1.  **Write Unit Tests:** Create a `pkg/networkspeed/networkspeed_test.go` file. The repository has many examples. Once written, you can run them with `make unit-test`.
2.  **Run Integration Tests:** The project has a framework for integration tests that spin up real API servers. You can add one for your plugin and run it via `make integration-test`.
3.  **Pushing to a Real Registry:** When you are ready to share your scheduler, you can use the `push-images` target. This requires setting environment variables:
    ```bash
    # Example for pushing to Docker Hub
    export REGISTRY=docker.io/your-username
    export RELEASE_VERSION=v0.1.0
    make push-images 
    ```
    This will build and push a properly tagged image (e.g., `docker.io/your-username/kube-scheduler:v0.1.0`) to a remote registry.
4.  **Contribute Back:** If you've built a generally useful plugin, you can contribute it back to the `scheduler-plugins` project! Following this workflow (`make verify`, adding tests) is the first step to a successful Pull Request.