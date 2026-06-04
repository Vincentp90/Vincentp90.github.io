---
layout: page
title: Resume
permalink: /resume/
---

{% assign data = site.data.resume %}

<!-- Hero -->
<section class="resume-hero">
  <h1>{{ data.name }}</h1>
  <p class="hero-title">{{ data.title }}</p>
  <p class="hero-location">{{ data.location }}</p>
  <div class="hero-contact">
    {% if data.email %}<a href="mailto:{{ data.email }}">{{ data.email }}</a>{% endif %}    
    {% for link in data.links %}
      <a href="{{ link.last }}" target="_blank" rel="noopener">{{ link.first | capitalize }}</a>
    {% endfor %}
    {% if data.phone %}<span>{{ data.phone }}</span>{% endif %}
  </div>
</section>

<!-- Experience -->
<section class="resume-section">
  <h2 class="section-title">Experience</h2>
  {% for job in data.experience %}
    <div class="job">
      <div class="job-header">
        <h3 class="job-role">{{ job.role }}</h3>
        <span class="job-period">{{ job.period }}</span>
      </div>
      <p class="job-company">{{ job.company }}</p>
      <ul class="job-details">
        {% for detail in job.details %}
          <li>{{ detail }}</li>
        {% endfor %}
      </ul>
      {% if job.projects %}
        <div class="projects">
          {% for project in job.projects %}
            <div class="project">
              <div class="job-header">
                <h3 class="job-role">{{ project.role }}</h3>
                <span class="job-period">{{ project.period }}</span>
              </div>
              <p class="job-company">{{ project.client }}</p>
              <ul class="job-details">
                {% for detail in project.details %}
                  <li>{{ detail }}</li>
                {% endfor %}
              </ul>
            </div>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  {% endfor %}
</section>

<!-- Education -->
<section class="resume-section">
  <h2 class="section-title">Education</h2>
  {% for edu in data.education %}
    <div class="education-item">
      <div class="edu-header">
        <h3>{{ edu.degree }}</h3>
        <span class="edu-year">{{ edu.year }}</span>
      </div>
      <p class="edu-school">{{ edu.school }}</p>
      {% if edu.details %}
        <p class="edu-details">{{ edu.details }}</p>
      {% endif %}
    </div>
  {% endfor %}
</section>

<!-- Skills -->
<section class="resume-section">
  <h2 class="section-title">Skills</h2>
  {% if data.skills.languages %}
    <h3 class="sub-title">Languages & Frameworks</h3>
    <div class="skill-bars">
      {% for skill in data.skills.languages %}
        <div class="skill-bar">
          <span class="skill-name">{{ skill.name }}</span>
          <div class="skill-track">
            <div class="skill-fill" style="width: {{ skill.level }}%"></div>
          </div>
        </div>
      {% endfor %}
    </div>
  {% endif %}
  {% if data.skills.tools %}
    <h3 class="sub-title">Tools & Technologies</h3>
    <div class="skill-tags">
      {% for tool in data.skills.tools %}
        <span class="skill-tag">{{ tool }}</span>
      {% endfor %}
    </div>
  {% endif %}
</section>

<!-- Spoken Languages -->
<section class="resume-section">
  <h2 class="section-title">Spoken Languages</h2>
  {% for lang in data.spoken_languages %}
    <div class="language-item">
      <span class="language-name">{{ lang.name }}</span>
      <span class="language-level">{{ lang.level }}</span>
    </div>
  {% endfor %}
</section>

<!-- Blog preview -->
<section class="resume-section">
  <h2 class="section-title">Latest Posts</h2>
  <div class="blog-preview">
    {% for post in site.posts limit: 3 %}
      <a href="{{ post.url | relative_url }}" class="preview-link">
        <h3 class="preview-title">{{ post.title }}</h3>
        <time class="preview-date">{{ post.date | date: "%B %d, %Y" }}</time>
      </a>
    {% endfor %}
  </div>
</section>
