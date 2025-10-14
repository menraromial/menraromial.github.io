---
title: "Talks"
layout: default
permalink: /talks/
collection: talks
entries_layout: list
nav: true
---

# Talks

Welcome to the Talks page! Here you will find a collection of all the talks and presentations.

{% assign sorted_talks = site.talks | sort: 'date' | reverse %}
{% for talk in sorted_talks %}
- **[{{ talk.title }}]({{ talk.url | relative_url }})**  
    _{{ talk.date | date: "%B %d, %Y" }}_  
    {{ talk.excerpt }}
{% endfor %}
