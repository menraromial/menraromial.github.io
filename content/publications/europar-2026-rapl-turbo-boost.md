---
title: "Understanding Power Limiting Mechanisms in Modern Processors: A Deep Dive into Intel RAPL and Turbo Boost Dynamics"
date: "2026-04-30"
build:
  render: never
  list: always
authors:
  - "Romial Menra"
  - "Guillaume Rosinosky"
  - "Remous-Aris Koutsiamanis"
  - "Sébastien Bolle"
  - "Jean-Marc Menaud"
venue: "Euro-Par 2026 - European Conference on Parallel and Distributed Computing, Lecture Notes in Computer Science, Springer, pp. 135-149"
venueShort: "Euro-Par"
year: 2026
award: "Best Paper Award nominee"
note: "Acceptance rate: 26.2%"
doi: "10.1007/978-3-032-35251-4_10"
links:
  - label: "EUROPAR"
    url: "https://www.easychair.org/smart-program/Euro-Par2026/2026-08-27.html#:~:text=10%3A55-,Romial%20Menra,-(IMT%20Atlantique%2C%20Inria"

---

Hardware-based power capping is essential for managing electrical consumption constraints and operational costs in data centers and High-Performance Computing. While the Intel Running Average Power Limit (RAPL) interface offers fine-grained control capabilities on modern servers, the interaction between its configuration parameters and the hardware's dynamic performance boost mechanisms remains complex and often misunderstood. This paper provides a comprehensive understanding of these mechanisms and their effects on power consumption and Quality of Service. First, we conduct a sensitivity analysis to characterize how each parameter influences the processor's throttling behavior. Based on the underlying exponential weighted moving average logic, we derive an analytical model to predict the effective duration of high-performance states. We validate this model through extensive experiments on four Intel Xeon microarchitectures. Furthermore, we quantify the impact of power capping on overall energy efficiency. Our experiments confirm that restricting power does not systematically lead to energy savings, highlighting a critical efficiency threshold below 50\% of the Thermal Design Power, where the increase in execution time severely outweighs the power reduction. This work provides system administrators and researchers with the necessary insights to effectively configure power constraints while avoiding performance pitfalls.