---
layout: page
title: Blog
permalink: /blog/
description: Technical writing and thoughts.
---

<div class="blog-list">
  {% for post in site.posts %}
    <a href="{{ post.url | relative_url }}" class="blog-card-link">
      <article class="blog-card">
        <h2 class="blog-card-title">{{ post.title }}</h2>
        <time class="blog-card-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
        <p class="blog-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
      </article>
    </a>
  {% endfor %}
</div>

{% if site.posts.size == 0 %}
  <p class="empty-state">No posts yet. Check back soon!</p>
{% endif %}
