---
description: "Talks and presentations by Menra Romial (Romial Menra): Euro-Par 2026 on Intel RAPL and Turbo Boost, energy-aware Kubernetes orchestration, grid-responsive cloud computing."
title: "Talks"
---

## Understanding Power Limiting Mechanisms in Modern Processors

**Euro-Par 2026** - 32nd International European Conference on Parallel and Distributed Computing, Pisa, Italy · August 2026
Nominated for the **Best Paper Award**

Conference talk presenting a deep dive into Intel RAPL and Turbo Boost dynamics, and how their interaction governs power capping on modern servers. Joint work with Guillaume Rosinosky, Remous-Aris Koutsiamanis, Sébastien Bolle (Orange Research) and Jean-Marc Menaud.

The talk answered three questions about the RAPL "black box":

- **Sensitivity:** turbo behaviour is driven by the long-term window and the two power limits, while the short-term window turns out to be negligible.
- **Model:** a closed-form expression predicts the effective turbo duration with an R² close to 1 across four Intel Xeon microarchitectures.
- **Energy:** capping below 50% of the Thermal Design Power systematically destroys energy efficiency, as the execution time penalty outweighs the power reduction.

[Slides (PDF)](/pdf/talk/RAPL-power-capping-and-turbo-boost.pdf) · [Paper](/publications/) · [DOI](https://doi.org/10.1007/978-3-032-35251-4_10)

---

## Energy-Aware Kubernetes Orchestration for Grid-Responsive Computing

**STACK Team Seminar** - Arzon, France · October 2025

A comprehensive approach to adapting Kubernetes workloads to electricity grid fluctuations through constraint-based scheduling and dynamic scaling, addressing the challenges of electricity price volatility and grid stability in cloud computing environments.

Related posts:
- [Building a Custom Kubernetes Scheduler](/posts/guide-building-custom-kubernetes-scheduler/)
- [Building a Kubernetes Controller with Kubebuilder](/posts/building-a-kubernetes-controller-with-kubebuilder-from-scratch/)

---

## Integration of the Energy Aspect in Kubernetes

**ComPAS 2024** - Faculty of Medicine, Nantes, France · July 2024

Presented at the French-speaking conference on computer science focusing on parallelism, architecture, and systems. The talk covered:

- Energy-aware scheduling strategies
- Monitoring and metrics collection for energy consumption
- Custom Kubernetes schedulers for energy optimization
- Real-world use cases and implementations

Key takeaways: energy efficiency is becoming increasingly important in cloud computing; Kubernetes can be extended to consider energy metrics in scheduling decisions; custom schedulers provide flexibility for implementing energy-aware policies.
