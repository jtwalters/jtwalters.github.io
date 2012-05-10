---
layout: post
title: "CSS Image Replacement"
date: 2011-05-11 18:53
comments: true
categories: [accessibility, seo]
---
If you aren't familiar with the CSS jargon "image replacement", it is essentially a way to replace an `h1` heading—or other text-based content—with an image or company logo. This way you can have a fancy graphic instead of plain text, and maintain accessibility and SEO benefits.

There are many [CSS image replacement techniques](http://css-tricks.com/css-image-replacement/) out there. Notably, the FIR or "Fahrner Image Replacement" technique is among the most popular. However, this method is [not deemed accessible](http://www.alistapart.com/articles/fir/).

The goal of image replacement techniques is to be compatible with the most possible browser (user agent) configurations and to be accessible. This means we want to support browsers with a 1% or greater market share in various configurations (e.g. CSS on/off, images on/off), as well as screen readers and other assistive technologies.

My [personal preference for image replacement](http://alicious.com/2009/new-css-image-replacement-jir/) involves using an `a` (anchor tag) inside an `h1` or other block element. It is called the "LLJ" method, and it should work on all major browsers, including IE6+.

Below is the HTML/CSS to implement this technique. It's also hosted [on jsfiddle](http://jsfiddle.net/jtwalters/gJAjY/1/).

**HTML:**
{% codeblock lang:html %}
<h1 id="title">
  <a href="http://example.com" title="example title">Meaningful Text</a>
</h1>
{% endcodeblock %}

**CSS:**
{% codeblock lang:css %}
h1#title {
  position: relative;  /* allows child element to be placed positioned wrt this one */
  margin: 0;           /* adjust margin as needed */
  padding: 0;          /* needed to counter the reset/default styles */
  height: 50px;        /* height of replacement image */
  overflow: hidden;    /* hide the text */
}

h1#title a {
  position: absolute;  /* defaults to top:0, left:0 and so these can be left out */
  height: 0;           /* force 0 height */
  width: 100%;         /* width of parent */
  padding-top: 50px;   /* match height of h1#title above */
  background: url(replacement-image.png) top left no-repeat;
}
{% endcodeblock %}
