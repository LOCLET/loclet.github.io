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
<article class="post">

    <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>

    <div class="entry">
        {{ post.excerpt }}
    </div>

    <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Mehr lesen</a>
</article>
{% endfor %}
