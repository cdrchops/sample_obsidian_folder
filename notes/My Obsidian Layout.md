---
title: My Obsidian Layout
dateCreated: 12Jun25T06:07:40
dateModified: 12Jun25T06:49:51
tags: 
 - ""
links:
status: "initial - Black"
---

[[How I have my Obsidian laid out]]
[PARA Alternatives ⬇ : r/ObsidianMD](https://www.reddit.com/r/ObsidianMD/comments/1dpsss1/comment/laklilz/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

This is going to read like it's complicated... but it's really not.  TLDR at the bottom

I use a bullet journal approach.  I have a daily log that I track daily notes, tasks, and TODOs.  As I think of notes I add them to that file during the day.  At the end of the day I go through my log and annotate the checkboxes with my custom markdown/CSS setup.  Any notes I took during the day that I have a file on I move to that file.  If there is not a file then I move them to one giant todo/task file that I review weekly.

If I'm looking at an article I will pull that article in Markdown and make my notes.  I use yinote to annotate YT videos and save the notes as markdown.

My folder setup is however I decide.  As I have a topic I think deserves its own top-level topic folder I will move it to a new folder under notes and give it a number.  I originally did this because I thought I'd need an order... but now it's so that I don't have the folders jump around in alphabetic order. Just a personal preference.

https://imgur.com/a/BVq1U83

I wrote some Groovy script to handle my upcoming daily notes.  I put my tasks and their date/due date and whatever other information in a single line.  Then run the script and it will find a matching file for that date or create a new one, set up the file, then add the tasks.  That way I can use it in my taskalendar.  I also modified the tasksCalendar code to do more of what I want.  I have a way to go to finish my ideas, but it's coming along so I have a custom taskalendar.

My notes all have front matter which I use a lot of tags with.  All of my daily log notes have front matter and a custom layout for 5 tasks to accomplish during the day, rollover notes (tasks I didn't finish the day before), and notes to sort.  Notes to sort are the notes I make during the day that I mentioned above that I review in the evening.

Each morning I look at my daily note for that day to see if I need to adjust my 5 tasks or add something.

My frontmatter for daily logs is pretty extensive.  I utilize a lot of properties to catalog my day.  These include weight, allergens noted, and how I feel among other things.  I then use dataview to create views.

For my topics I have index pages.  These are notes that contain links to individual notes and may link directly to a heading in a note.  They are designed to be a place to go look for information about a specific topic.  For example, I have a main topic of "uboats and war" this topic is a bit wider and I probably should've just called it "war research" because it includes the Revolutionary War, Civil War, WWI, WWII, Vietnam, and Iraq.  But also includes different topics like "U-boats" and different medical badges from around the world.  So I have an index page that is for U-boats and it links to diagrams, KM ranks, KM ratings, WWI vs WWII uboats, and more because I have a lifelong fascination with submarines.  I also have an index page that contains links to OIF notes I've taken from my time there.  Like maps, stories from my deployment, and more.  I don't have to look through all of the notes to find the information, just go to the index page and it has "pre-deployment," "kuwait," "BIAP," "Kirzah range," etc. Which contain stories, notes, photos, and more.

I utilize plugins like templater to make sure my notes have a standard layout.

TLDR; I have a template for daily-logs that includes a bunch of front matter that I use in dataviews.  I add notes to the bottom of the daily-log of things I think of.  At the end of the day I move those notes to an appropriate location in my vault.  When the notes on a topic get to be big enough for their own note or topic then they are moved as such and if they get really big they get their own topic folder.  Each morning, I review my 5 tasks, roll my notes over from the day before, and more.

I'm sure I'm not thinking of something that I do.

IDK if this helps or not.  The end result is basically a system that works for my brain and it works quite well for me.

[[How I use Obsidian]]

Further research:
[Automating #Obsidian - Generate Notes About Your Media Consumption via RSS - Books, TV, Movies, Music | Lou Plummer](https://amerpie.lol/2024/05/02/automating-obsidian-generate.html)
https://amerpie.lol/2024/05/12/task-management-with.html

Inspired by this post: https://www.reddit.com/r/ObsidianMD/comments/1cxaprw/using_obsidian_as_a_life_record/

I don't quite do all of what they do. I don't do anything with email - except maybe a note that I need to reply or something

I do have a daily-log, which is pretty much all of my tasks and todos for the day, including rollover from the previous day

My front matter is tagged - and sometimes I add additional tags other than the "daily-log" tag. Most of the front matter is for other notes and not my daily-log, but the data is such a small footprint I keep it.

---
dateCreated: 29Mar24T12:21:41
dateModified: 21May24T09:30:48
tags:
- "#tags/notes/daily-log"
title: 21May24
status: "initial - Black"
---

The title seems redundant, but sometimes the title for the file is an abridged version and this may be the complete title. For example, when I sometimes save articles from the net I may make the file name "Obsidian Tasks Management", but the actual article title is something like "Obsidian Tasks Approach to Creation and Management for your Daily Life for a Better Organized Life" or whatever.

I do have some notes about people I meet (not all of them, just ones I might meet again), and sometimes I'll include a review of a restaurant - for these, I just tag the review instead of having a whole new note. I can see the benefit in a new note for just a restaurant, but I choose not to utilize that approach.

My daily log contains a summary of the day and my journal entry. It also keeps the tasks I've completed or canceled. I have my own checkbox styles for various aspects. I also used the Things 2 theme to further define my own checkbox styles: [https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/alt-checkboxes.png](https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/alt-checkboxes.png) - these are the ones from Things 2; I have more defined and even more I'm working on: [https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/Obsidian_VBDVxeJyky.png](https://github.com/cdrchops/obsidian-wink-doubleguns-theme/blob/master/docs/Images/Obsidian_VBDVxeJyky.png)

I used to use [https://github.com/JasonBraddy/obsidian-templater-helpers](https://github.com/JasonBraddy/obsidian-templater-helpers) for my rollover items, and it was good; I even modified it. However, now I use the Rollover Daily Todos plugin. Each day, I run the rollover command, and any tasks/todos from the day before that weren't completed are automatically put in the current day's list.

Each morning when I rollover the tasks I also go through them and see if I should move them to my global TODO list that contains everything I either don't have time to get to or are items that are cool projects, but I don't have the time to work on them or they're so far out that I needn't worry about them today. For those items, I do put inline tags like [due::] or [startDate::] which I use Tasks Calendar (another plugin I modified) [https://github.com/702573N/Obsidian-Tasks-Calendar](https://github.com/702573N/Obsidian-Tasks-Calendar) - Tasks Calendar uses dataview to pull in items from where you choose and put them on a calendar. I use it a lot.

# Daily Todo List

- [ ] Up at 6
- [ ] bed 10
- [ ] shave
- [ ] shower
- [ ] am meds
- [ ] pm meds
- [ ] 8 hrs sleep
- [ ] study for class
- [ ] work on fun projects
- [ ] missy time
- [ ] brothers time/friends

To this end, with the Tasks Calendar, Rollover, custom theme, and checkboxes, I use a Bullet Journal style of managing my notes. I do have folders. The folders are just base recognition of a topic, e.g. military and medical to put all of my military scans, notes, and everything into along with all of my medical records (VA, civilian, etc) because the two go hand-in-hand 90% of the time. I do have a subfolder for just military and one for just medical. It doesn't have to make sense to you; it does make sense to me.

Back to the BuJo style. Each day when I'm making notes in my daily-log I may have a topic that is going to be its own note file. Just the other day, I added some notes where I was doing some research and certain movies and tv shows would've helped me with that. I created a subsection in my daily-log that I added these titles to. The next morning I created a new note just for that list. Now, if I needed to watch a documentary for a class or something I'd leave that as a task with a [due::] tag. But when I watch the movie I'll use YiNote Chrome extension to take notes and then create a separate note [file] for just that documentary. Which would contain a link to imdb, the yinote notes I took, tagged appropriately, and maybe a summary of what I thought about the video. I do this with some youtube videos too because I have cyclical research interests so I might research further advances in "Computer Vision" today, and in a year I'll do it again. If I keep notes on which videos are useful or which ones I've watched then I can start my next set of research where I left off and not spend the time watching the same videos or reading the same articles again.

I do have a way I catalog which shows my wife and I watch (which means we are both working on a computer while the tv is on) and a way to pull when those shows have release dates and times coming up. Those are then made into elements that show up on my tasks calendar. I don't comment on these; I just mark them watched when we're done.

I do have a list of locations I've been that are of interest to me or my kids in the future. For example, I know every location I went to outside of the US. I have journal entries from those times as well as notable events that I've looked up - for example, the UN Bombing in Baghdad in 2003 I have some articles and notes about that event. I don't keep track of every location I've ever been nor do I have notes on every location, just the ones that make sense. Like the VA here, I have the contact numbers, team number, and some other info. Just because it's often hard to find the exact detail you need on the VA site and sometimes it changes but they don't update the site. So I know my note is slightly more reliable than the site.

I use a lot of tags for files and inline tags, either with a # or [due::] etc. This makes my work with dataview much better. For example, while studying arrhythmias, I created notes for each one, then added front matter to set some data and then a heading in each (#Strips) to be able to show the different rhythm strips for that arrhythmia I'd found or had for a patient (no patient data is on the strips). Then I use dataview to pull them all together into a table that even has smaller versions of the rhythm strips.

Back to BuJo - I also made an index page for specific topics. Like one of the software projects I'm working on has an index page for it that has different headings inside. I link to different notes that are different aspects of the work - such as what hardware, software, deployment, testing, etc. It helps me keep track of my projects much better and also when I do research I can catalog my notes under headings categories.  I have almost all of my physical paper files digitized into obsidian, tagged, summarized, and annotated.  As I can I retype the notes with my handwriting in them, or I OCR the text if it's not my handwriting.

https://www.reddit.com/r/ObsidianMD/s/WXDfklkyiY

https://www.reddit.com/r/ObsidianMD/s/bKdNpjGOev

https://www.reddit.com/r/ObsidianMD/s/vMwVlm0Ig6

https://www.reddit.com/r/ObsidianMD/s/re9iiviO8i

https://imgur.com/a/WReM705

[[Checkbox Styles]]