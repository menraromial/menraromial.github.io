// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-bookshelf",
          title: "Bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "nav-talks",
          title: "Talks",
          description: "Conference talks and presentations by MENRA W. Romial (Menra Wedwang Romial) on cloud computing, Kubernetes, edge technologies, and energy-aware computing.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/talks/";
          },
        },{id: "nav-blog",
          title: "Blog",
          description: "Technical blog by MENRA W. Romial (Menra Wedwang Romial) covering cloud computing, Kubernetes, edge technologies, IoT, and energy-aware computing.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Open artefacts, running experiments, and side-quests.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-resume",
          title: "Resume",
          description: "This page contains my professional curriculum vitae, showcasing my skills, experiences, and achievements. You can also download a PDF version for offline viewing.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Courses taught by MENRA W. Romial at IMT Atlantique.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-gallery",
          title: "Gallery",
          description: "Conferences, fieldwork, people, and places.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/gallery/";
          },
        },{id: "post-a-comprehensive-guide-to-powercap-utils-on-linux",
        
          title: "A Comprehensive Guide to powercap-utils on Linux",
        
        description: "powercap-utils is a suite of user-space command-line tools for Linux that allow you to interact with the kernel&#39;s Power Capping Framework. This framework provides a standardized way to monitor and limit the power consumption of hardware devices.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/comprehensive-guide-powercap-utils-linux/";
          
        },
      },{id: "post-building-a-kubernetes-controller-with-kubebuilder-from-scratch",
        
          title: "Building a Kubernetes Controller with Kubebuilder from Scratch",
        
        description: "In this tutorial, you will learn how to build a custom Kubernetes controller (also known as an Operator) using Kubebuilder. We will create a Custom Resource Definition (CRD) for a simple Website resource.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/building-a-kubernetes-controller-with-kubebuilder-from-scratch/";
          
        },
      },{id: "post-guide-to-building-a-custom-kubernetes-scheduler",
        
          title: "Guide to Building a Custom Kubernetes Scheduler",
        
        description: "Here is a complete, A-to-Z guide in English to develop and deploy your own Kubernetes scheduler using the Scheduling Framework. This guide is practical, detailed, and follows a step-by-step approach from concept to a working deployment in a kubeadm cluster.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/guide-building-custom-kubernetes-scheduler/";
          
        },
      },{id: "post-master-the-ci-cd-pipeline-locally",
        
          title: "Master the CI/CD Pipeline Locally",
        
        description: "Welcome to this comprehensive course on DevOps culture and tooling. The goal is to guide you, step-by-step, from theory to practice, empowering you to build, secure, and automate a full Continuous Integration and Continuous Deployment (CI/CD) pipeline.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/master-ci-ci-pipeline-locally/";
          
        },
      },{id: "post-setting-up-a-kubernetes-cluster-with-kubeadm-and-cri-o",
        
          title: "Setting Up a Kubernetes Cluster with Kubeadm and CRI-O",
        
        description: "Learn how to set up a production-ready Kubernetes cluster using Kubeadm and CRI-O. This step-by-step guide covers prerequisites, installation, configuration, and best practices for deploying and managing your cluster effectively.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/kubernetes-with-kubeadm-and-cri.io/";
          
        },
      },{id: "post-setting-up-a-k3s-cluster-with-a-hello-world-deployment",
        
          title: "Setting Up a K3s Cluster with a Hello-World Deployment",
        
        description: "A comprehensive guide to setting up a lightweight Kubernetes cluster using K3s, deploying a &quot;Hello-World&quot; application, and exploring Kubernetes concepts like namespaces, deployments, services, and scaling with Horizontal Pod Autoscalers.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/setup-k3s-cluster/";
          
        },
      },{id: "books-kubernetes-masterclass-from-beginner-to-expert",
          title: 'Kubernetes Masterclass: From Beginner to Expert',
          description: "A comprehensive guide to Kubernetes from first principles to production-grade deployments. Designed for developers, system administrators, and DevOps engineers who want to move beyond the basics and understand how container orchestration actually works at scale.",
          section: "Books",handler: () => {
              window.location.href = "/books/kubernetes-masterclass/";
            },},{id: "books-autobiography",
          title: 'Autobiography',
          description: "A personal account of my journey from my early years to my current work in cloud computing and sustainable technology. Covers formative experiences, academic milestones, research into energy-aware computing, and reflections on what it means to build systems that last.",
          section: "Books",handler: () => {
              window.location.href = "/autobiography/";
            },},{id: "news-volunteering-at-ucc-amp-bdcat-2025-my-experience",
          title: 'Volunteering at UCC &amp;amp; BDCAT 2025 — My Experience',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/volunteering-ucc-bdcat-nantes-2025/";
            },},{id: "news-welcoming-clement-obama-as-a-new-m2-research-intern-april-september-2026-working-on-reactive-control-of-energy-constraints-in-kubernetes-clusters-multi-lever-re-adaptation-policy-with-sla-management",
          title: 'Welcoming Clement Obama as a new M2 research intern (April–September 2026) working on...',
          description: "",
          section: "News",},{id: "news-proud-to-announce-that-our-paper-understanding-power-limiting-mechanisms-in-modern-processors-a-deep-dive-into-intel-rapl-and-turbo-boost-dynamics-co-authored-with-guillaume-rosinosky-remous-aris-koutsiamanis-sébastien-bolle-and-jean-marc-menaud-has-been-accepted-at-euro-par-2026",
          title: 'Proud to announce that our paper “Understanding Power Limiting Mechanisms in Modern Processors:...',
          description: "",
          section: "News",},{id: "talks-integration-of-the-energy-aspect-in-kubernetes",
          title: 'Integration of the Energy Aspect in Kubernetes',
          description: "",
          section: "Talks",handler: () => {
              window.location.href = "/talks/compas-conference-2024/";
            },},{id: "talks-energy-aware-kubernetes-orchestration-for-grid-responsive-computing",
          title: 'Energy-Aware Kubernetes Orchestration for Grid-Responsive Computing',
          description: "",
          section: "Talks",handler: () => {
              window.location.href = "/talks/stack-team-seminar-2025/";
            },},{id: "teachings-bases-de-donnees-databases",
          title: 'Bases de Donnees (Databases)',
          description: "TD/TP on relational databases: DBMS, SQL, normalization theory, conceptual modeling, and programmatic interfaces.",
          section: "Teachings",handler: () => {
              window.location.href = "/teaching/bases-de-donnees/";
            },},{id: "teachings-cloud-computing-vmware-vsphere",
          title: 'Cloud Computing (VMware vSphere)',
          description: "TP on cloud infrastructure using VMware vSphere/vCenter: virtual machine management, resource allocation, and cloud deployment.",
          section: "Teachings",handler: () => {
              window.location.href = "/teaching/cloud-vmware/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%69%74%73%6D%65@%6D%65%6E%72%61%72%6F%6D%69%61%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/menraromial", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/menraromial", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@menraromial", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0007-0943-8593", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/mwrdev_", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
