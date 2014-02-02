---
layout: post
title: "More Mobile Navigation Options"
date: 2012-06-09 14:41
comments: true
categories: 
---
I've been following along mobile navigation options on the twitters and
came across some interesting approaches to solving this UX issue.

## [Smart mobile navigation without hacks](http://www.netmagazine.com/tutorials/build-smart-mobile-navigation-without-hacks)

This option makes use of the :target CSS pseudo-class selector, which
lets you style elements referenced by the URL `#fragment`.

It's a CSS-only solution that works on most modern browsers (Chrome, Firefox, Safari, IE 9+), however, it is currently incompatible with Opera Mobile since the :target CSS doesn't seem to trigger a page update. Doh!

Cool, huh? Bravo to [Aaron Gustafson](http://aaron-gustafson.com/) for
coming up with the solution. Hopefully an Opera Mobile workaround will
be available soon.

## [An alternative to select elements as navigation in narrow viewports](http://www.456bereastreet.com/archive/201206/an_alternative_to_select_elements_as_navigation_in_narrow_viewports/)

Instead of using a select drop-down on narrow screens, why not recreate
the experience with toggleable blocks that you style your way?

Interesting alternative to using the somewhat awkward select drop-down.
Maybe I'll give it a shot.
