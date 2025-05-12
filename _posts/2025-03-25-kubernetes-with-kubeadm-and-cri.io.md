---
layout: post
title: Setting Up a Kubernetes Cluster with Kubeadm and CRI-O
date: 2025-03-25 16:40:16
description : Learn how to set up a production-ready Kubernetes cluster using Kubeadm and CRI-O. This step-by-step guide covers prerequisites, installation, configuration, and best practices for deploying and managing your cluster effectively.
tags: Kubernetes kubeadm cri.io beginners
categories: tutorial
---

## Prerequisites
Before setting up a Kubernetes cluster using Kubeadm and CRI-O, ensure that you meet the following requirements:

### Hardware Requirements
- At least **2 GB of RAM** per node (4 GB recommended for the master node)
- At least **2 CPUs** per node
- **20 GB of free disk space**
- A stable **internet connection**
- All nodes should be able to communicate with each other

### Software Requirements
- A supported **Linux distribution** (Ubuntu 20.04+ or Debian 10+ recommended)
- User access with **sudo privileges**
- Basic understanding of **Linux command-line interface (CLI)**
- Knowledge of **networking concepts**

## Step 1: Configure Kernel Parameters
Kubernetes requires some kernel parameters to be set to allow IPtables to see bridged traffic.

### Load Required Kernel Modules
Run the following commands on all nodes:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

### Set Kernel Parameters for Kubernetes
```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
```

Apply the changes:
```bash
sudo sysctl --system
```

## Step 2: Disable Swap
Kubernetes does not work well with swap enabled. Disable it using:
```bash
swapoff -a
```

To make this change persistent, remove any swap entries from `/etc/fstab`:
```bash
sudo nano /etc/fstab
```

## Step 3: Install CRI-O (Container Runtime Interface - Open)

### Add CRI-O Repository and Install
```bash
sudo apt-get update -y
sudo apt-get install -y software-properties-common gpg curl apt-transport-https ca-certificates

curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/Release.key | \
    gpg --dearmor | sudo tee /etc/apt/keyrings/cri-o-apt-keyring.gpg >/dev/null
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/ /" | \
    sudo tee /etc/apt/sources.list.d/cri-o.list

sudo apt-get update -y
sudo apt-get install -y cri-o
```

### Enable and Start CRI-O Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable crio --now
sudo systemctl start crio.service
```

## Step 4: Install Kubernetes Components

### Add Kubernetes Repository
```bash
KUBERNETES_VERSION=1.30
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v$KUBERNETES_VERSION/deb/Release.key | \
    gpg --dearmor | sudo tee /etc/apt/keyrings/kubernetes-apt-keyring.gpg > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v$KUBERNETES_VERSION/deb/ /" | \
    sudo tee /etc/apt/sources.list.d/kubernetes.list
```

### Install Kubeadm, Kubelet, and Kubectl
```bash
sudo apt-get update -y
sudo apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1 kubeadm=1.30.0-1.1
```

### Configure Kubelet Node IP
```bash
sudo apt-get install -y jq
local_ip="$(ip --json addr show eno1 | jq -r '.[0].addr_info[] | select(.family == "inet") | .local')"

sudo tee /etc/default/kubelet > /dev/null << EOF
KUBELET_EXTRA_ARGS=--node-ip=$local_ip
EOF
```

**Note:** `eno1` and `enp85s0` are network interface names that may vary depending on the system. You can check your network interfaces using:
```bash
ifconfig -a
```
or
```bash
ip a
```
Adjust the interface name accordingly based on the output of these commands.

## Step 5: Initialize Kubernetes on the Master Node

Set the master node IP and hostname:
```bash
IPADDR="$(ip --json addr show enp85s0 | jq -r '.[0].addr_info[] | select(.family == "inet") | .local')"
NODENAME=$(hostname -s)
POD_CIDR="192.168.0.0/16"
```

Initialize Kubernetes:
```bash
sudo kubeadm init --apiserver-advertise-address=$IPADDR --apiserver-cert-extra-sans=$IPADDR --pod-network-cidr=$POD_CIDR --node-name $NODENAME --ignore-preflight-errors Swap --cri-socket unix:///var/run/crio/crio.sock 
```

Set up kubeconfig for the root user:
```bash
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

## Step 6: Deploy Network and Monitoring Components

### Install Calico Network Plugin
```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

### Install Metrics Server
```bash
kubectl apply -f https://raw.githubusercontent.com/techiescamp/kubeadm-scripts/main/manifests/metrics-server.yaml
```

### Install Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.49.0/deploy/static/provider/baremetal/deploy.yaml
```

## Step 7: Join Worker Nodes to the Cluster

Generate a join command on the master node:
```bash
kubeadm token create --print-join-command
```

Run the output command on worker nodes to join them to the cluster.

## Step 8: Verify Cluster Status

### Check Nodes
```bash
kubectl get nodes
```

### Check All Pods in a Specific Node
```bash
kubectl get pods --all-namespaces --field-selector spec.nodeName=<NODE_NAME>
```
## Troubleshooting Tips
- Always check system logs: `journalctl -u kubelet`
- Verify node status: `kubectl get nodes`
- Check pod status: `kubectl get pods --all-namespaces`

## Security Considerations
- Regularly update Kubernetes and CRI-O
- Implement RBAC (Role-Based Access Control)
- Use network policies
- Regularly scan containers for vulnerabilities

**Note**: Always refer to the official Kubernetes and CRI-O documentation for the most up-to-date information and best practices.

