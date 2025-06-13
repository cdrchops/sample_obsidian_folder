---
title: ROLLOVER SCRIPT
dateCreated: 12Jun25T06:12:27
dateModified: 12Jun25T06:47:56
tags:
  - "#daily-log"
---

```groovy
package com.winkdoubleguns.testApp  

import java.text.SimpleDateFormat  

def PATH = "/mnt/c/projects/sample_obsidian_folder/calendar/"
  
SimpleDateFormat sdf = new SimpleDateFormat("ddMMMYY")  
def today = Calendar.getInstance()
def yesterday = Calendar.getInstance()  
yesterday.set(Calendar.DATE, (yesterday.get(Calendar.DATE) - 1))  

def firstFileName = sdf.format(yesterday.getTime())
def secondFileName = sdf.format(today.getTime())

def firstFile = new File("${PATH}${firstFileName}.md")  
def secondFile = new File("${PATH}${secondFileName}.md")

if (!secondFile.exists()) {
	secondFile.write("")
}

if (!firstFile.exists() || !secondFile.exists()) {
	return
}

def lines = firstFile.readLines()  
  
enum HEADING {FIVE_TASKS, ROLLOVER, NOTES_TO_SORT, NONE}  
def isAppropriateHeading = HEADING.NONE  
def lineList = []  
def notesSortList = []  
def originalLinesRemove = []  
  
lines.eachWithIndex {line, idx ->  
    if (line.startsWith("#") && !line.startsWith("##") && !line.startsWith("####") && !line.startsWith("####")) {  
        if (line.startsWith("# 5 Tasks for the Day") || line.startsWith("# Rollover Notes")) {  
            isAppropriateHeading = HEADING.FIVE_TASKS  
        } else if (line.startsWith("# Notes to Sort")) {  
            isAppropriateHeading = HEADING.NOTES_TO_SORT  
        } else {  
            isAppropriateHeading = HEADING.NONE  
        }  
    } 
    
    if (isAppropriateHeading != HEADING.NONE && isAppropriateHeading != HEADING.NOTES_TO_SORT && "" != line) {  
        if (line.startsWith(/ - [ ] /) || line.startsWith(/- [ ] /)) {  
            originalLinesRemove << idx  
            lineList << line  
        }
    } else if (isAppropriateHeading == HEADING.NOTES_TO_SORT) {  
        originalLinesRemove << idx  
	    notesSortList << line  
    }  
}  
  

def lines2 = secondFile.readLines()  
  
def newLines = []  
  
lines2.each {  
    newLines << it  
    if (it.startsWith("# Rollover Notes")) {  
        lineList.each {line ->  
            newLines << line  
        }  
    } else if (it.startsWith("# Notes to Sort")) {  
        notesSortList.each {line ->  
            newLines << line  
        }  
    }  
}  

secondFile.write(newLines.join("\n"))  
  
originalLinesRemove.reverse().each {  
    lines.remove(it)  
}  
  
firstFile.write(lines.join("\n"))

println "done"
```