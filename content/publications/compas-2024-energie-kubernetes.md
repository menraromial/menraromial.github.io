---
title: "Intégration de l'Aspect Énergétique dans Kubernetes"
date: "2024-07-02"
build:
  render: never
  list: always
authors:
  - "Romial Menra"
  - "Remous-Aris Koutsiamanis"
  - "Jean-Marc Menaud"
venue: "COMPAS 2024 - Conférence francophone d'informatique en Parallélisme, Architecture et Système, Nantes, France"
venueShort: "COMPAS"
year: 2024
links:
  - label: "HAL"
    url: "https://hal.science/hal-05638939"
---

Les centres de données consomment une part croissante de l'énergie mondiale, souvent de manière inefficace en raison d'une mauvaise adéquation entre les ressources allouées et la consommation réelle. Nous proposons d'intégrer la gestion énergétique directement dans Kubernetes en exploitant les interfaces RAPL (Running Average Power Limit) des processeurs modernes. Notre approche permet un ordonnancement des conteneurs sensible à la consommation énergétique réelle du serveur, réduisant le gaspillage sans compromettre les performances applicatives.
