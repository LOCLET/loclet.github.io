---
layout: post
title: Development
author: klaas
---

Seriously, there are too few hours in a day. The past weeks have been racing by and we have gone through 2(!) beta 
versions of our app, which seems crazy.

Time for a much-needed blog update. Today I don’t want to talk about the app itself (which has made great progress on
 both Android and iOS), but rather, I’d like to give you a brief impression of how we go about developing it.

![]({{ site.baseurl }}/assets/content/loclet_office_01.jpg)

This is us, the LOCLET team, on a regular work day (and a nerf gun on the table). When we started 
LOCLET, we asked ourselves: Which factors are really important to us? Here are some of the answers:

* **Face time**: We try to work as directly and closely together as possible (you may have guessed that from the picture
 above ;-). It just makes our lives easier. When somebody has a question, they just ask across the room.

* **Quick decisions**: No need to hold lengthy meetings, send emails or wait for approval from a hierarchy of decision 
makers. When we need to decide something, we briefly discuss it with everyone involved and then... we simply decide 
it. We “implement“ that decision from the next second on.

* **Tools**: We live in a marvelous decade where teams are empowered by incredibly useful tools and services at no or 
very little cost. We use [Slack](https://slack.com/) for team communication,
[Google Apps](https://www.google.com/work/apps/business/) for working and sharing, both [GitHub](https://github.com/)
and [BitBucket](https://bitbucket.org/) for maintaining our code, [Travis CI](https://travis-ci.com/) for continuous 
integration, [Heroku](https://www.heroku.com/) as our production platform, [Mailchimp](http://mailchimp.com/) for 
campaigns, [Zendesk](https://www.zendesk.com/) for feedback etc. What did people do 10 years ago?

* **Fast iterations**: We don’t know the answers to many important questions regarding our product. The best way to 
find out is to implement a solid first guess, verify it with users and then iterate. You don’t need to (and seldom 
will) get it right the first time, but you need to keep retrying quickly enough.

![]({{ site.baseurl }}/assets/content/loclet_office_02.jpg)

So how do we develop our app then? We’re currently on a schedule of bi-weekly beta releases. We’re loosely following
a Kanban approach, where every task (anything from fixing a bug to calling someone for marketing) is represented by a
post-it on our board.

Post-its move through 4 phases: When created, they’re put in the *In Planning* column. Periodically, we move batches
of Post-its to the *Selected* column, from where they advance - one by one - to the *In Progress* column. When 
completed, they are put in the last column labeled *Done*.

![]({{ site.baseurl }}/assets/content/kanban_01.jpg)

Every Monday, we have a weekly meeting (this is actually our only full-team meeting!) in which every team member 
takes their notes out of the “Done” column, briefly recaps the things they achieved (or had to struggle with ;-) and
ceremoniously puts them into the transparent recepticle pictured on the right.

If you’re wondering about the warning sign and the funny paper funnel at the top of the vase, here’s a story for you:
When we finally got hold of a suitable glass vase, we proudly threw our first round of completed post-its into it. 
Only to find the vase completely empty the next morning. The - by all means well-meaning - cleaning personnel had 
dutifully emptied what appeared to be a weird trash can with a bunch of crumpled notes. Before our next weekly, we 
attached a nice warning sign with a crossed-out trash can and the message “Please do not empty” (in German):

![]({{ site.baseurl }}/assets/content/do_not_empty.png)

Well, that didn’t cut it either - on Tuesday the vase was empty, again! (The cleaning personnel must have thought: 
“Gee, now it even has a sign saying it’s not a trash can, and they still throw stuff in there…”). So we turned to the
drastic measure of firmly attaching a one-way funnel at the top. Turn it upside down all you want - *ain’t no note 
ever leaving that vase again!*

In closing, our development schedule currently feels a bit like a rollercoaster ride: The speed is breathtaking 
(sometimes even a little scary) and so is the workload. Progress has been (and continues to be) amazing, though, and 
one of the most movitating things is to look at our Kanban vase filling up with colored notes. Here is an exclusive 
close-up for you:

![]({{ site.baseurl }}/assets/content/kanban_02.jpg)
