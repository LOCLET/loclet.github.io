---
layout: page
title: Blog
permalink: /blog/
---

<div class="cover-crop">
    <img class="cover" src="{{ site.baseurl }}/assets/content/typewriter.jpg"/>
</div>

<h2>Blog</h2>

{% for post in site.posts %}
<article class="post mb40">
    <a href="{{ site.baseurl }}{{ post.url }}">
    <div>    
        <div class="date date-fw box-red pull-left">
            <p class="day">{{ post.date | date: "%-d" }}</p>
            <p class="month">{{ post.date | date: "%b" }}</p>
        </div>
        <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>
        <div class="entry">
            {{ post.excerpt }}
        </div>
    </div>
    </a>
</article>
{% endfor %}
