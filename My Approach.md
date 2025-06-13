---
title: My Approach
dateCreated: 12Jun25T06:08:53
dateModified: 12Jun25T07:25:16
tags: 
 - ""
links:
status: "initial - Black"
---

When I start my day I create a new daily-note in the calendar directory.

I rollover the previous days notes which get put into the Rollover Note section.

I use the script in [[ROLLOVER SCRIPT]] that I wrote in Groovy.  If you use this then you'll have to install Groovy.  I use WSL so I've installed it using http://sdkman.io - it's up to you.  If you want to rewrite it using something else, feel free.  I was using the rollover todo script, but it stopped working and this was faster for me to use.  The only help I can give you is after you've installed Groovy, go to the Settings -> Community Plugins -> Execute Code -> Groovy path and change it to match your path.  As I said I use WSL so my path is to my sdkman installation which is in /home/<username>/.sdkman..... like the one in this vault has set to mine locally.

The way to use it is to have the current daily note and the previous day daily note in the calendar directory.  Open the rollover script and go to the reading view in Obsidian then click the Run button at the bottom.

Once those are rolled over, I look at the previous day's Notes To Sort heading.  As I go through the day, I will make notes here then at the end of the day or first thing the next day I'll go over them and decide via a Bullet Journal approach if they: a) belong in their own note b) if they are part of an existing note or c) belong in a consolidated group note

for a) it may be a topic I was working on that is going to be it's own note
for b) this may be additional research on an existing topic
for c) this could be todos that I wanted to do, but now are in my backlog for life

Then I go through my todos.  I don't have a todo note here in this vault, but it contains all of my todos, notes, items that I feel like would be wasteful to have their own note.  If there are items that I think I'm going to do today, I'll pull them out and put them in the daily tasks.  I may also find duplicate todos or items that I'm never going to do, or I've done already and I can just remove them.

After that is done, I begin marking off items in my Self-Care heading and move on about my day.

If I add items to calendar notes they can be seen by going to the indices -> My Taskalendar.  I've heavily modified my version and still have a lot to do.  The version out at the github app is perfectly fine, I was just doing some extra things.  One of the things that this calendar looks for is the day in yyyy-mm-dd format.  Now, I still have tweaking to do because I use DDMMMYY format for everything.  So, this particular approach on my end isn't working as well as it once did.  Right now, there are some issues that I haven't fixed so I need to work on those and it may just be the copy I put in this vault from my original vault. I'll have to look at these later.  You can just use the original Tasks Calendar here [[https://github.com/702573N/Obsidian-Tasks-Calendar]]

I have many templates that I use including one for my notes, one for my daily notes, and some for general things I do in my notes.  Most of these you won't use.

In my theme, included in this vault, I have defined my own checkbox styles that I use in everything I do.  You can check it out in the page in the notes directory.  I still have like four that I need to add icons for.  All of this code is checked in to my theme in github.  I also used the Things 2 theme to further define my own checkbox styles: [https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/alt-checkboxes.png](https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/alt-checkboxes.png) - these are the ones from Things 2; I have more defined and even more I'm working on: [https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/Obsidian_VBDVxeJyky.png](https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/Obsidian_VBDVxeJyky.png)

[[Checkbox Styles]]
[[https://imgur.com/a/BVq1U83]]

You can see examples of my index pages.  In my notes, I'll have folders for different topics.  I actually numbered these according to an arbitrary and archaic system... e.g. when I thought of a topic I needed I upped the number.  So 001-inbox, 002-todo, and so on.  That means for submarines I have 310-submarines and uboats - 310 is the hull number of the USS-Batfish which resides in Muskogee Oklahoma and I've visited many times.  Adding numbers to your topic directories is up to you.

I'm sure there's something I'm forgetting.  The taskalendar