let {
    pages,
    view,
    firstDayOfWeek,
    globalTaskFilter,
    dailyNoteFolder,
    dailyNoteFormat,
    startPosition,
    upcomingDays,
    css,
    options
} = input;

// Error Handling
if (!pages && pages !== "") {
    dv.span('> [!ERROR] Missing pages parameter\n> \n> Please set the pages parameter like\n> \n> `pages: ""`');
    return false;
}

if (!options.includes("style")) {
    dv.span('> [!ERROR] Missing style parameter\n> \n> Please set a style inside options parameter like\n> \n> `options: "style1"`');
    return false;
}

if (!view) {
    dv.span('> [!ERROR] Missing view parameter\n> \n> Please set a default view inside view parameter like\n> \n> `view: "month"`');
    return false;
}

if (firstDayOfWeek) {
    if (firstDayOfWeek.match(/[|\\0123456]/g) === null) {
        dv.span('> [!ERROR] Wrong value inside firstDayOfWeek parameter\n> \n> Please choose a number between 0 and 6');
        return false;
    }

} else {
    dv.span('> [!ERROR] Missing firstDayOfWeek parameter\n> \n> Please set the first day of the week inside firstDayOfWeek parameter like\n> \n> `firstDayOfWeek: "1"`');
    return false;
}

if (startPosition) {
    if (!startPosition.match(/\d{4}\-\d{1,2}/gm)) {
        dv.span('> [!ERROR] Wrong startPosition format\n> \n> Please set a startPosition with the following format\n> \n> Month: `YYYY-MM` | Week: `YYYY-ww`');
        return false;
    }
}

if (dailyNoteFormat) {
    if (dailyNoteFormat.match(/[|\\YMDWwd.,-: \[\]]/g).length !== dailyNoteFormat.length) {
        dv.span('> [!ERROR] The `dailyNoteFormat` contains invalid characters');
        return false;
    }
}

// Variables
var done, doneWithoutCompletionDate, due, recurrence, overdue, start, scheduled, process, cancelled, dailyNote, dailyNoteRegEx;

var tasks = dv.pages(pages).file.tasks;

// Get, Set, Eval Pages
if (pages === "") {
    tasks = dv.pages().file.tasks;
} else if (typeof pages === "string" && pages.startsWith("dv.pages")) {
    tasks = eval(pages);
} else if (typeof pages && pages.every(p => p.task)) {
    tasks = pages;
}

var currDaFo = false;

var tmpDateFormat = currDaFo ? "YYYY-MM-DD" : "DDMMMYY";
var taskDateFormat = currDaFo ? "(\\d{4}\\-\\d{2}\\-\\d{2})" : "(\\d{2}\\w{3}\\d{2})";
var yearMonth = currDaFo ? "YYYY-MM" : "DMMYY";
var monthYear = currDaFo ? "MMM-YYYY" : "MMMYY";

dailyNoteFormat = tmpDateFormat;

// if (!dailyNoteFormat) {
//     dailyNoteFormat = tmpDateFormat
//     console.log("daily Note format " + dailyNoteFormat);
// }

dailyNoteRegEx = momentToRegex(dailyNoteFormat);
var tToday = moment().format(tmpDateFormat);
var tMonth = moment().format("M");//MMM
var tDay = moment().format("d");//DD
var tYear = moment().format("YYYY");
var tid = (new Date()).getTime();

var selectedMonth = startPosition ? moment(startPosition, yearMonth).date(1) : moment(startPosition).date(1);
var selectedList = startPosition ? moment(startPosition, yearMonth).date(1) : moment(startPosition).startOf("week");
var selectedWeek = startPosition ? moment(startPosition, "wwYY").startOf("week") : moment(startPosition).date(1);
var selectedDate = eval("selected" + capitalize(view));
var arrowLeftIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
var arrowRightIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
var filterIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>';
var monthIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>';
var weekIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M17 14h-6"></path><path d="M13 18H7"></path><path d="M7 14h.01"></path><path d="M17 18h.01"></path></svg>';
var dailyIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-day" viewBox="0 0 16 16"><path d="M4.684 12.523v-2.3h2.261v-.61H4.684V7.801h2.464v-.61H4v5.332h.684zm3.296 0h.676V9.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98v4.105zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 1 0 0-.855.426.426 0 0 0-.43.43zm.094 5.093h.672V8.418h-.672v4.105z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/><path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/></svg>'
var listIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';
var calendarClockIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h5"></path><path d="M17.5 17.5 16 16.25V14"></path><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path></svg>';
var calendarCheckIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>';
var calendarHeartIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"></path></svg>';
var cellTemplate = "<div class='cell {{class}}' data-weekday='{{weekday}}'><a class='internal-link cellName' href='{{dailyNote}}'>{{cellName}}</a><div class='cellContent'>{{cellContent}}</div></div>";
var taskTemplate = "<a class='internal-link' href='{{taskPath}}'><div class='task {{class}}' style='{{style}}' title='{{title}}'><div class='inner'><div class='note'>{{note}}</div><div class='icon'>{{icon}}</div><div class='description' data-relative='{{relative}}'>{{taskContent}}</div></div></div></a>";

const rootNode = dv.el("div", "", {
    cls: "tasksCalendar " + options,
    attr: {id: "tasksCalendar" + tid, view: view, style: 'position:relative;-webkit-user-select:none!important'}
});

if (css) {
    var style = document.createElement("style");
    style.innerHTML = css;
    rootNode.append(style)
}

var taskDoneIcon = "✅";
var taskDueIcon = "📅";
var taskScheduledIcon = "⏳";
var taskRecurrenceIcon = "🔁";
var taskOverdueIcon = "⚠️";
var taskProcessIcon = "⏺️";
var taskCancelledIcon = "🚫";
var taskStartIcon = "🛫";
var taskDailyNoteIcon = "📄";
var taskLowPriorityIcon = "🔽";
var taskMediumPriorityIcon = "🔼";
var taskHighPriorityIcon = "⏫";

//https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
function getDateRegex(icon) {
    var str1 = `${icon}\\W${taskDateFormat}`;
    return new RegExp(str1, "g");
}

var datesMap = new Map();
var dailyNotePath = "";

// Initialze
getMeta(tasks);
setButtons();
setStatisticPopUp();
setWeekViewContext();
eval("get" + capitalize(view))(tasks, selectedDate);

function addDatesToMap(date, tasksForDate = "") {
    var tmpItem = {};
    if (datesMap.has(date)) {
        tmpItem = datesMap.get(date);
    } else {
        tmpItem = tasksForDate;
    }

    var dailyNotePath = date;
    if (dailyNoteFolder) {
        dailyNotePath = dailyNoteFolder + "/" + date
    }

    tmpItem.path = dailyNotePath;
    datesMap.set(date, tmpItem);
}

function getMeta(tasks) {
    for (i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var taskText = task.text;
        var taskFile = getFilename(task.path);
        var dailyNoteMatch = taskFile.match(eval(dailyNoteRegEx));
        var dailyTaskMatch = taskText.match(taskDateFormat);
        if (dailyNoteMatch && !dailyTaskMatch) {
            task.dailyNote = moment(dailyNoteMatch[1], dailyNoteFormat).format(tmpDateFormat)
            // console.log("#1 DailyNote " + task.dailyNote);
        }

        // var dueMatch = taskText.match(/\📅\W(\d{4}\-\d{2}\-\d{2})/);
        // if (dueMatch) {
        //     task.due = dueMatch[1];
        //     task.text = task.text.replace(dueMatch[0], "");
        // }
        //
        // var startMatch = taskText.match(/\🛫\W(\d{4}\-\d{2}\-\d{2})/);
        // if (startMatch) {
        //     task.start = startMatch[1];
        //     task.text = task.text.replace(startMatch[0], "");
        // }
        //
        // var scheduledMatch = taskText.match(/\⏳\W(\d{4}\-\d{2}\-\d{2})/);
        // if (scheduledMatch) {
        //     task.scheduled = scheduledMatch[1];
        //     task.text = task.text.replace(scheduledMatch[0], "");
        // }
        //
        // var completionMatch = taskText.match(/\✅\W(\d{4}\-\d{2}\-\d{2})/);
        // if (completionMatch) {
        //     task.completion = completionMatch[1];
        //     task.text = task.text.replace(completionMatch[0], "");
        // }

        var repeatMatch = taskText.includes("🔁");
        if (repeatMatch) {
            task.recurrence = true;
            task.text = task.text.substring(0, taskText.indexOf("🔁"))
        }

        var lowMatch = taskText.includes(taskLowPriorityIcon);
        if (lowMatch) {
            task.priority = "D";
        }

        var mediumMatch = taskText.includes(taskMediumPriorityIcon);
        if (mediumMatch) {
            task.priority = "B";
        }

        var highMatch = taskText.includes(taskHighPriorityIcon);
        if (highMatch) {
            task.priority = "A";
        }

        if (!lowMatch && !mediumMatch && !highMatch) {
            task.priority = "C";
        }
        if (globalTaskFilter) {
            task.text = task.text.replaceAll(globalTaskFilter, "");
        } else {
            task.text = task.text.replaceAll("#task", "");
        }

        task.text = task.text.replaceAll("[[", "");
        task.text = task.text.replaceAll("]]", "");
        task.text = task.text.replace(/\[.*?\]/gm, "");
    }
}

function getFilename(path) {
    return path.match(/^(?:.*\/)?([^\/]+?|)(?=(?:\.[^\/.]*)?$)/)[1];
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function getMetaFromNote(task, metaName) {
    var meta = dv.pages('"' + task.link.path + '"')[metaName][0];
    return meta ? meta : "";
}

function transColor(color, percent) {
    var num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}

function momentToRegex(momentFormat) {
    momentFormat = momentFormat.replaceAll(".", "\\.");
    momentFormat = momentFormat.replaceAll(",", "\\,");
    momentFormat = momentFormat.replaceAll("-", "\\-");
    momentFormat = momentFormat.replaceAll(":", "\\:");
    momentFormat = momentFormat.replaceAll(" ", "\\s");

    momentFormat = momentFormat.replace("dddd", "\\w{1,}");
    momentFormat = momentFormat.replace("ddd", "\\w{1,3}");
    momentFormat = momentFormat.replace("dd", "\\w{2}");
    momentFormat = momentFormat.replace("d", "\\d{1}");

    momentFormat = momentFormat.replace("YYYY", "\\d{4}");
    momentFormat = momentFormat.replace("YY", "\\d{2}");

    momentFormat = momentFormat.replace("MMMM", "\\w{1,}");
    momentFormat = momentFormat.replace("MMM", "\\w{3}");
    momentFormat = momentFormat.replace("MM", "\\d{2}");

    momentFormat = momentFormat.replace("DDDD", "\\d{3}");
    momentFormat = momentFormat.replace("DDD", "\\d{1,3}");
    momentFormat = momentFormat.replace("DD", "\\d{2}");
    momentFormat = momentFormat.replace("D", "\\d{1,2}");

    momentFormat = momentFormat.replace("ww", "\\d{1,2}");

    regEx = "/^(" + momentFormat + ")$/";

    return regEx;
}

function taskProcessor(currentDatZ) {
    // if (datesMap.has(currentDate)) {
    //     populateTasks(datesMap.get(currentDate).tasks);
    // } else {
        getTasks(currentDatZ);
    // }
}

function populateTasks(tasks) {
    done = tasks.done;
    due = tasks.due;
    recurrence = tasks.recurrence;
    overdue = tasks.overdue;
    start = tasks.start;
    scheduled = tasks.scheduled;
    process = tasks.process;
    cancelled = tasks.cancelled;
    dailyNote = tasks.dailyNote;

    var tasksForDate = {title: `${date}`, path: "", tasks: {done: done, due: due, recurrence: recurrence, overdue: overdue, start: start, scheduled: scheduled, process: process, cancelled: cancelled, dailyNote: dailyNote}}

    addDatesToMap(date, tasksForDate);
}

function getTasks(date) {
    done = tasks.filter(t => t.completed && t.checked && t.completion && moment(t.completion.toString()).isSame(date)).sort(t => t.completion);
    doneWithoutCompletionDate = tasks.filter(t => t.completed && t.checked && !t.completion && t.due && moment(t.due.toString()).isSame(date)).sort(t => t.due);
    done = done.concat(doneWithoutCompletionDate);
    due = tasks.filter(t => !t.completed && !t.checked && !t.recurrence && t.due && moment(t.due.toString()).isSame(date)).sort(t => t.due);
    recurrence = tasks.filter(t => !t.completed && !t.checked && t.recurrence && t.due && moment(t.due.toString()).isSame(date)).sort(t => t.due);
    overdue = tasks.filter(t => !t.completed && !t.checked && t.due && moment(t.due.toString()).isBefore(date)).sort(t => t.due);
    start = tasks.filter(t => !t.completed && !t.checked && t.start && moment(t.start.toString()).isSame(date)).sort(t => t.start);
    scheduled = tasks.filter(t => !t.completed && !t.checked && t.scheduled && moment(t.scheduled.toString()).isSame(date)).sort(t => t.scheduled);
    process = tasks.filter(t => !t.completed && !t.checked && t.due && t.start && moment(t.due.toString()).isAfter(date) && moment(t.start.toString()).isBefore(date));
    cancelled = tasks.filter(t => !t.completed && t.checked && t.due && moment(t.due.toString()).isSame(date)).sort(t => t.due);
    dailyNote = tasks.filter(t => !t.completed && !t.checked && t.dailyNote && moment(t.dailyNote.toString()).isSame(date)).sort(t => t.dailyNote);

    // var tasksForDate = {
    //     title: `${date}`,
    //     path: "",
    //     tasks: {
    //         done: done,
    //         due: due,
    //         recurrence: recurrence,
    //         overdue: overdue,
    //         start: start,
    //         scheduled: scheduled,
    //         process: process,
    //         cancelled: cancelled,
    //         dailyNote: dailyNote
    //     }
    // }

    // addDatesToMap(date, tasksForDate);
}

function setTask(obj, cls) {
    var lighter = 25;
    var darker = -40;
    var noteColor = getMetaFromNote(obj, "color");
    var textColor = getMetaFromNote(obj, "textColor");
    var noteIcon = getMetaFromNote(obj, "icon");
    var taskText = obj.text.replace("'", "&apos;");
    var taskPath = obj.link.path.replace("'", "&apos;");
    var taskIcon = eval("task" + capitalize(cls) + "Icon");
    var relative = obj.due ? moment(obj.due).fromNow() : "";

    var noteFilename = getFilename(taskPath);
    if (noteIcon) {
        noteFilename = noteIcon + "&nbsp;" + noteFilename
    } else {
        noteFilename = taskIcon + "&nbsp;" + noteFilename;
        cls += " noNoteIcon"
    }

    var taskSubpath = obj.header.subpath;
    var taskLine = taskSubpath ? taskPath + "#" + taskSubpath : taskPath;
    var style = "--task-background:#7D7D7D33;--task-color:#7D7D7D;--dark-task-text-color:" + transColor("#7D7D7D", darker) + ";--light-task-text-color:" + transColor("#7D7D7D", lighter);
    if (noteColor && textColor) {
        style = "--task-background:" + noteColor + "33;--task-color:" + noteColor + ";--dark-task-text-color:" + textColor + ";--light-task-text-color:" + textColor;
    } else if (noteColor && !textColor) {
        style = "--task-background:" + noteColor + "33;--task-color:" + noteColor + ";--dark-task-text-color:" + transColor(noteColor, darker) + ";--light-task-text-color:" + transColor(noteColor, lighter);
    } else if (!noteColor && textColor) {
        style = "--task-background:#7D7D7D33;--task-color:#7D7D7D;--dark-task-text-color:" + transColor(textColor, darker) + ";--light-task-text-color:" + transColor(textColor, lighter);
    }

    var newTask = taskTemplate.replace("{{taskContent}}", taskText).replace("{{class}}", cls).replace("{{taskPath}}", taskLine).replace("{{due}}", "done").replaceAll("{{style}}", style).replace("{{title}}", noteFilename + ": " + taskText).replace("{{note}}", noteFilename).replace("{{icon}}", taskIcon).replace("{{relative}}", relative);
    return newTask;
}

function setTaskContentContainer(currentDate) {
    var cellContent = "";

    function compareFn(a, b) {
        if (a.priority.toUpperCase() < b.priority.toUpperCase()) {
            return -1;
        }

        if (a.priority.toUpperCase() > b.priority.toUpperCase()) {
            return 1;
        }

        if (a.priority === b.priority) {
            if (a.text.toUpperCase() < b.text.toUpperCase()) {
                return -1;
            }

            if (a.text.toUpperCase() > b.text.toUpperCase()) {
                return 1;
            }

            return 0;
        }
    }

    function showTasks(tasksToShow, type) {
        const sorted = [...tasksToShow].sort(compareFn);
        for (var t = 0; t < sorted.length; t++) {
            // console.log("Task " + sorted[t].text);
            cellContent += setTask(sorted[t], type)
        }
    }

    if (tToday === currentDate) {
        showTasks(overdue, "overdue");
    }

    showTasks(due, "due");
    showTasks(recurrence, "recurrence");
    showTasks(start, "start");
    showTasks(scheduled, "scheduled");
    showTasks(process, "process");
    showTasks(dailyNote, "dailyNote");
    showTasks(done, "done");
    showTasks(cancelled, "cancelled");
    return cellContent;
}

function setButtons() {
    var buttons = "<button class='filter'>" + filterIcon + "</button><button class='listView' title='List'>" + listIcon + "</button><button class='monthView' title='Month'>" + monthIcon + "</button><button class='weekView' title='Week'>" + weekIcon + "</button><button class='current'></button><button class='previous'>" + arrowLeftIcon + "</button><button class='next'>" + arrowRightIcon + "</button><button class='statistic' percentage=''></button>";
    rootNode.querySelector("span").appendChild(dv.el("div", buttons, {cls: "buttons", attr: {}}));
    setButtonEvents();
}

function setButtonEvents() {
    rootNode.querySelectorAll('button').forEach(btn => btn.addEventListener('click', (() => {
        var activeView = rootNode.getAttribute("view");
        if (btn.className === "previous") {
            if (activeView === "month") {
                selectedDate = moment(selectedDate).subtract(1, "months");
                getMonth(tasks, selectedDate);
            } else if (activeView === "week") {
                selectedDate = moment(selectedDate).subtract(7, "days").startOf("week");
                getWeek(tasks, selectedDate);
            } else if (activeView === "list") {
                selectedDate = moment(selectedDate).subtract(1, "months");
                getList(tasks, selectedDate);
            }
        } else if (btn.className === "current") {
            if (activeView === "month") {
                selectedDate = moment().date(1);
                getMonth(tasks, selectedDate);
            } else if (activeView === "week") {
                selectedDate = moment().startOf("week");
                getWeek(tasks, selectedDate);
            } else if (activeView === "list") {
                selectedDate = moment().date(1);
                getList(tasks, selectedDate);
            }

        } else if (btn.className === "next") {
            if (activeView === "month") {
                selectedDate = moment(selectedDate).add(1, "months");
                getMonth(tasks, selectedDate);
            } else if (activeView === "week") {
                selectedDate = moment(selectedDate).add(7, "days").startOf("week");
                getWeek(tasks, selectedDate);
            } else if (activeView === "list") {
                selectedDate = moment(selectedDate).add(1, "months");
                getList(tasks, selectedDate);
            }

        } else if (btn.className === "filter") {
            rootNode.classList.toggle("filter");
            rootNode.querySelector('#statisticDone').classList.remove("active");
            rootNode.classList.remove("focusDone");
        } else if (btn.className === "monthView") {
            if (moment().format("ww-YYYY") === moment(selectedDate).format("ww-YYYY")) {
                selectedDate = moment().date(1);
            } else {
                selectedDate = moment(selectedDate).date(1);
            }

            getMonth(tasks, selectedDate);
        } else if (btn.className === "listView") {
            if (moment().format("ww-YYYY") === moment(selectedDate).format("ww-YYYY")) {
                selectedDate = moment().date(1);
            } else {
                selectedDate = moment(selectedDate).date(1);
            }

            getList(tasks, selectedDate);
        } else if (btn.className === "weekView") {
            if (rootNode.getAttribute("view") === "week") {
                var leftPos = rootNode.querySelector("button.weekView").offsetLeft;
                rootNode.querySelector(".weekViewContext").style.left = leftPos + "px";
                rootNode.querySelector(".weekViewContext").classList.toggle("active");
                if (rootNode.querySelector(".weekViewContext").classList.contains("active")) {
                    var closeContextListener = function () {
                        rootNode.querySelector(".weekViewContext").classList.remove("active");
                        rootNode.removeEventListener("click", closeContextListener, false);
                    };
                    setTimeout(function () {
                        rootNode.addEventListener("click", closeContextListener, false);
                    }, 100);
                }

            } else {
                if (moment().format(monthYear) != moment(selectedDate).format(monthYear)) {
                    selectedDate = moment(selectedDate).startOf("month").startOf("week");
                } else {
                    selectedDate = moment().startOf("week");
                }

                getWeek(tasks, selectedDate);
            }

        } else if (btn.className === "statistic") {
            rootNode.querySelector(".statisticPopup").classList.toggle("active");
        }

        btn.blur();
    })));
    rootNode.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
}

function setWrapperEvents() {
    rootNode.querySelectorAll('.wrapperButton').forEach(wBtn => wBtn.addEventListener('click', (() => {
        var week = wBtn.getAttribute("data-week");
        var year = wBtn.getAttribute("data-year");
        selectedDate = moment(moment(year).add(week, "weeks")).startOf("week");
        rootNode.querySelector(`#tasksCalendar${tid} .grid`).remove();
        getWeek(tasks, selectedDate);
    })));
}

function setStatisticPopUpEvents() {
    rootNode.querySelectorAll('.statisticPopup li').forEach(li => li.addEventListener('click', (() => {
        var group = li.getAttribute("data-group");
        const liElements = rootNode.querySelectorAll('.statisticPopup li');
        if (li.classList.contains("active")) {
            const liElements = rootNode.querySelectorAll('.statisticPopup li');
            for (const liElement of liElements) {
                liElement.classList.remove('active');
            }

            rootNode.classList.remove("focus" + capitalize(group));
        } else {
            for (const liElement of liElements) {
                liElement.classList.remove('active');
            }

            li.classList.add("active");
            rootNode.classList.remove.apply(rootNode.classList, Array.from(rootNode.classList).filter(v => v.startsWith("focus")));
            rootNode.classList.add("focus" + capitalize(group));
        }

    })));
}

function setStatisticPopUp() {
    var statistic = "<li id='statisticDone' data-group='done'></li>";
    statistic += "<li id='statisticDue' data-group='due'></li>";
    statistic += "<li id='statisticOverdue' data-group='overdue'></li>";
    statistic += "<li class='break'></li>";
    statistic += "<li id='statisticStart' data-group='start'></li>";
    statistic += "<li id='statisticScheduled' data-group='scheduled'></li>";
    statistic += "<li id='statisticRecurrence' data-group='recurrence'></li>";
    statistic += "<li class='break'></li>";
    statistic += "<li id='statisticDailyNote' data-group='dailyNote'></li>";
    rootNode.querySelector("span").appendChild(dv.el("ul", statistic, {cls: "statisticPopup"}));
    setStatisticPopUpEvents();
}

function setWeekViewContextEvents() {
    rootNode.querySelectorAll('.weekViewContext li').forEach(li => li.addEventListener('click', (() => {
        var selectedStyle = li.getAttribute("data-style");
        const liElements = rootNode.querySelectorAll('.weekViewContext li');
        if (!li.classList.contains("active")) {
            for (const liElement of liElements) {
                liElement.classList.remove('active');
            }

            li.classList.add("active");
            rootNode.classList.remove.apply(rootNode.classList, Array.from(rootNode.classList).filter(v => v.startsWith("style")));
            rootNode.classList.add(selectedStyle);
        }

        rootNode.querySelector(".weekViewContext").classList.toggle("active");
    })));
}

function setWeekViewContext() {
    var activeStyle = Array.from(rootNode.classList).filter(v => v.startsWith("style"));
    var liElements = "";
    var styles = 11;

    for (i = 1; i < styles + 1; i++) {
        var liIcon = "<div class='liIcon iconStyle" + i + "'><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div><div class='box'></div></div>";
        liElements += "<li data-style='style" + i + "'>" + liIcon + "Style " + i + "</li>";
    }

    rootNode.querySelector("span").appendChild(dv.el("ul", liElements, {cls: "weekViewContext"}));
    rootNode.querySelector(".weekViewContext li[data-style=" + activeStyle + "]").classList.add("active");
    setWeekViewContextEvents();
}

function setStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter) {
    var taskCounter = parseInt(dueCounter + doneCounter + overdueCounter);
    var tasksRemaining = taskCounter - doneCounter;
    var percentage = Math.round(100 / (dueCounter + doneCounter + overdueCounter) * doneCounter);
    percentage = isNaN(percentage) ? 100 : percentage;

    if (dueCounter === 0 && doneCounter === 0) {
        rootNode.querySelector("button.statistic").innerHTML = calendarHeartIcon;
    } else if (tasksRemaining > 0) {
        rootNode.querySelector("button.statistic").innerHTML = calendarClockIcon;
    } else if (dueCounter === 0 && doneCounter !== 0) {
        rootNode.querySelector("button.statistic").innerHTML = calendarCheckIcon;
    }

    if (tasksRemaining > 99) {
        tasksRemaining = "⚠️"
    }

    rootNode.querySelector("button.statistic").setAttribute("data-percentage", percentage);
    rootNode.querySelector("button.statistic").setAttribute("data-remaining", tasksRemaining);
    rootNode.querySelector("#statisticDone").innerText = "✅ Done: " + doneCounter + "/" + taskCounter;
    rootNode.querySelector("#statisticDue").innerText = "📅 Due: " + dueCounter;
    rootNode.querySelector("#statisticOverdue").innerText = "⚠️ Overdue: " + overdueCounter;
    rootNode.querySelector("#statisticStart").innerText = "🛫 Start: " + startCounter;
    rootNode.querySelector("#statisticScheduled").innerText = "⏳ Scheduled: " + scheduledCounter;
    rootNode.querySelector("#statisticRecurrence").innerText = "🔁 Recurrence: " + recurrenceCounter;
    rootNode.querySelector("#statisticDailyNote").innerText = "📄 Daily Notes: " + dailyNoteCounter;
}

function removeExistingView() {
    if (rootNode.querySelector(`#tasksCalendar${tid} .grid`)) {
        rootNode.querySelector(`#tasksCalendar${tid} .grid`).remove();
    } else if (rootNode.querySelector(`#tasksCalendar${tid} .list`)) {
        rootNode.querySelector(`#tasksCalendar${tid} .list`).remove();
    }

}

function populateTasks(tasks) {
    done = tasks.done;
    due = tasks.due;
    recurrence = tasks.recurrence;
    overdue = tasks.overdue;
    start = tasks.start;
    scheduled = tasks.scheduled;
    process = tasks.process;
    cancelled = tasks.cancelled;
    dailyNote = tasks.dailyNote;
}

function getMonth(tasks, month) {
    removeExistingView();
    var currentTitle = "<span>" + moment(month).format("MMMM") + "</span><span> " + moment(month).format("YYYY") + "</span>";
    rootNode.querySelector('button.current').innerHTML = currentTitle;
    var gridContent = "";
    var firstDayOfMonth = moment(month).format("d");
    var firstDateOfMonth = moment(month).startOf("month").format("D");
    var lastDateOfMonth = moment(month).endOf("month").format("D");
    var dueCounter = 0;
    var doneCounter = 0;
    var overdueCounter = 0;
    var startCounter = 0;
    var scheduledCounter = 0;
    var recurrenceCounter = 0;
    var dailyNoteCounter = 0;

    // Move First Week Of Month To Second Week In Month View
    if (firstDayOfMonth === 0) {
        firstDayOfMonth = 7
    }

    // Set Grid Heads
    var gridHeads = "";
    for (h = 0 - firstDayOfMonth + parseInt(firstDayOfWeek); h < 7 - firstDayOfMonth + parseInt(firstDayOfWeek); h++) {
        var weekDayNr = moment(month).add(h, "days").format("d");
        var weekDayName = moment(month).add(h, "days").format("ddd");
        if (tDay === weekDayNr && tMonth === moment(month).format("M") && tYear === moment(month).format("YYYY")) {
            gridHeads += "<div class='gridHead today' data-weekday='" + weekDayNr + "'>" + weekDayName + "</div>";
        } else {
            gridHeads += "<div class='gridHead' data-weekday='" + weekDayNr + "'>" + weekDayName + "</div>";
        }
    }

    // Set Wrappers
    var wrappers = "";
    var starts = 0 - firstDayOfMonth + parseInt(firstDayOfWeek);
    for (w = 1; w < 7; w++) {
        var wrapper = "";
        var weekNr = "";
        var yearNr = "";
        var monthName = moment(month).format("MMM").replace(".", "").substring(0, 3);
        for (i = starts; i < starts + 7; i++) {
            if (i === starts) {
                weekNr = moment(month).add(i, "days").format("w");
                yearNr = moment(month).add(i, "days").format("YYYY");
            }

            var currentDate = moment(month).add(i, "days").format(tmpDateFormat);
            // console.log("#2 currentDate " + currentDate);
            var dailyNotePath = !dailyNoteFolder ? currentDate : dailyNoteFolder + "/" + currentDate;
            var weekDay = moment(month).add(i, "days").format("d");
            var shortDayName = moment(month).add(i, "days").format("D");
            var longDayName = moment(month).add(i, "days").format("D. MMM");
            var shortWeekday = moment(month).add(i, "days").format("ddd");

            // Filter Tasks
            // if (datesMap.has(currentDate)) {
            //     populateTasks(datesMap.get(currentDate).tasks);
            // } else {
                getTasks(currentDate);
            // }

            // Count Events Only From Selected Month
            if (moment(month).format("MM") === moment(month).add(i, "days").format("MM")) {
                dueCounter += due.length;
                dueCounter += recurrence.length;
                dueCounter += scheduled.length;
                dueCounter += dailyNote.length;
                doneCounter += done.length;
                startCounter += start.length;
                scheduledCounter += scheduled.length;
                recurrenceCounter += recurrence.length;
                dailyNoteCounter += dailyNote.length;

                // Get Overdue Count From Today
                // console.log("Overdue " + moment(month).add(i, "days").format(tmpDateFormat));
                // console.log("Today " + moment().format(tmpDateFormat));

                if (moment().format(tmpDateFormat) === moment(month).add(i, "days").format(tmpDateFormat)) {
                    overdueCounter = overdue.length;
                }
            }

            // Set New Content Container
            var cellContent = setTaskContentContainer(currentDate);


            console.log("moment days " + (moment(month).add(i, "days").format("D") === 1));
            // Set Cell Name And Weekday
            if (moment(month).add(i, "days").format("D") === 1) {
                var cell = cellTemplate.replace("{{date}}", currentDate).replace("{{cellName}}", longDayName).replace("{{cellContent}}", cellContent).replace("{{weekday}}", weekDay).replace("{{dailyNote}}", dailyNotePath);
                cell = cell.replace("{{class}}", "{{class}} newMonth");
            } else {
                var cell = cellTemplate.replace("{{date}}", currentDate).replace("{{cellName}}", shortDayName).replace("{{cellContent}}", cellContent).replace("{{weekday}}", weekDay).replace("{{dailyNote}}", dailyNotePath);
            }


            // Set prevMonth, currentMonth, nextMonth
            if (i < 0) {
                cell = cell.replace("{{class}}", "prevMonth");
            } else if (i >= 0 && i < lastDateOfMonth && tToday !== currentDate) {
                cell = cell.replace("{{class}}", "currentMonth");
            } else if (i >= 0 && i < lastDateOfMonth && tToday === currentDate) {
                cell = cell.replace("{{class}}", "currentMonth today");
            } else if (i >= lastDateOfMonth) {
                cell = cell.replace("{{class}}", "nextMonth");
            }

            wrapper += cell;
        }

        wrappers += "<div class='wrapper'><div class='wrapperButton' data-week='" + weekNr + "' data-year='" + yearNr + "'>W" + weekNr + "</div>" + wrapper + "</div>";
        starts += 7;
    }

    gridContent += "<div class='gridHeads'><div class='gridHead'></div>" + gridHeads + "</div>";
    gridContent += "<div class='wrappers' data-month='" + monthName + "'>" + wrappers + "</div>";
    rootNode.querySelector("span").appendChild(dv.el("div", gridContent, {cls: "grid"}));
    setWrapperEvents();
    setStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);
    rootNode.setAttribute("view", "month");
}

function getWeek(tasks, week) {
    removeExistingView();
    var currentTitle = "<span>" + moment(week).format("YYYY") + "</span><span> " + moment(week).format("[W]w") + "</span>";
    rootNode.querySelector('button.current').innerHTML = currentTitle
    var gridContent = "";
    var currentWeekday = moment(week).format("d");
    var weekNr = moment(week).format("[W]w");
    var dueCounter = 0;
    var doneCounter = 0;
    var overdueCounter = 0;
    var startCounter = 0;
    var scheduledCounter = 0;
    var recurrenceCounter = 0;
    var dailyNoteCounter = 0;

    for (i = 0 - currentWeekday + parseInt(firstDayOfWeek); i < 7 - currentWeekday + parseInt(firstDayOfWeek); i++) {
        var currentDate = moment(week).add(i, "days").format(tmpDateFormat);
        var dailyNotePath = !dailyNoteFolder ? currentDate : dailyNoteFolder + "/" + currentDate;
        var weekDay = moment(week).add(i, "days").format("d");
        var dayName = moment(currentDate).format("ddd D.");
        var longDayName = moment(currentDate).format("ddd, D. MMM");

        // Filter Tasks
        // if (datesMap.has(currentDate)) {
        //     populateTasks(datesMap.get(currentDate).tasks);
        // } else {
        //     getTasks(currentDate);
        // }
        getTasks(currentDate);

        // Count Events From Selected Week
        dueCounter += due.length;
        dueCounter += recurrence.length;
        dueCounter += scheduled.length;
        dueCounter += dailyNote.length;
        doneCounter += done.length;
        startCounter += start.length;
        scheduledCounter += scheduled.length;
        recurrenceCounter += recurrence.length;
        dailyNoteCounter += dailyNote.length;
        if (moment().format(tmpDateFormat) === moment(week).add(i, "days").format(tmpDateFormat)) {
            overdueCounter = overdue.length;
        }

        // Set New Content Container
        var cellContent = setTaskContentContainer(currentDate);

        // Set Cell Name And Weekday
        var cell = cellTemplate.replace("{{date}}", currentDate).replace("{{cellName}}", longDayName).replace("{{cellContent}}", cellContent).replace("{{weekday}}", weekDay).replace("{{dailyNote}}", dailyNotePath);

        // Set Cell Name And Weekday
        if (moment(week).add(i, "days").format("D") === 1) {
            cell = cellTemplate.replace("{{date}}", currentDate).replace("{{cellName}}", longDayName).replace("{{cellContent}}", cellContent).replace("{{weekday}}", weekDay).replace("{{dailyNote}}", dailyNotePath);
        } else {
            cell = cellTemplate.replace("{{date}}", currentDate).replace("{{cellName}}", dayName).replace("{{cellContent}}", cellContent).replace("{{weekday}}", weekDay).replace("{{dailyNote}}", dailyNotePath);
        }

        // Set Today, Before Today, After Today
        if (currentDate < tToday) {
            cell = cell.replace("{{class}}", "beforeToday");
        } else if (currentDate === tToday) {
            cell = cell.replace("{{class}}", "today");
        } else if (currentDate > tToday) {
            cell = cell.replace("{{class}}", "afterToday");
        }

        gridContent += cell;
    }

    rootNode.querySelector("span").appendChild(dv.el("div", gridContent, {cls: "grid", attr: {'data-week': weekNr}}));
    setStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);
    rootNode.setAttribute("view", "week");
}

function getList(tasks, month) {
    removeExistingView();
    var currentTitle = "<span>" + moment(month).format("MMMM") + "</span><span> " + moment(month).format("YYYY") + "</span>";
    rootNode.querySelector('button.current').innerHTML = currentTitle;
    var listContent = "";
    var dueCounter = 0;
    var doneCounter = 0;
    var overdueCounter = 0;
    var startCounter = 0;
    var scheduledCounter = 0;
    var recurrenceCounter = 0;
    var dailyNoteCounter = 0;

    // Loop Days From Current Month
    for (i = 0; i < moment(month).endOf('month').format("D"); i++) {
        var currentDate = moment(month).startOf('month').add(i, "days").format(tmpDateFormat);
        // console.log("#3 currentDate Month " + currentDate);
        var monthName = moment(month).format("MMM").replace(".", "").substring(0, 3);
        // console.log("month name " + monthName);


        // Filter Tasks
        // if (datesMap.has(currentDate)) {
        //     populateTasks(datesMap.get(currentDate).tasks);
        // } else {
        //     getTasks(currentDate);
        // }

        getTasks(currentDate);

        // Count Events
        dueCounter += due.length;
        dueCounter += recurrence.length;
        dueCounter += scheduled.length;
        dueCounter += dailyNote.length;
        doneCounter += done.length;
        startCounter += start.length;
        scheduledCounter += scheduled.length;
        recurrenceCounter += recurrence.length;
        dailyNoteCounter += dailyNote.length;

        console.log("#4 moment format current date " + moment().format(tmpDateFormat) + " currentDate " + currentDate);
        if (moment().format(tmpDateFormat) === currentDate) {
            overdueCounter = overdue.length;
            var overdueDetails = "<details open class='overdue'><summary>Overdue</summary>" + setTaskContentContainer(currentDate) + "</details>";
            var todayDetails = "<details open class='today'><summary>Today</summary>" + setTaskContentContainer(currentDate) + "</details>";

            // Upcoming
            if (!upcomingDays) {
                upcomingDays = "7"
            }

            var upcomingContent = "";
            for (t = 1; t < parseInt(upcomingDays) + 1; t++) {
                var next = moment(currentDate).add(t, "days").format(tmpDateFormat);
                // console.log("#5 Next " + next);
                getTasks(next);

                // if (datesMap.has(currentDate)) {
                //     populateTasks(datesMap.get(currentDate).tasks);
                // } else {
                //     getTasks(currentDate);
                // }

                upcomingContent += setTaskContentContainer(next);
            }

            var upcomingDetails = "<details open class='upcoming'><summary>Upcoming</summary>" + upcomingContent + "</details>";

            listContent += "<details open class='today'><summary><span>" + moment(currentDate).format("dddd, D") + "</span><span class='weekNr'> " + moment(currentDate).format("[W]w") + "</span></summary><div class='content'>" + overdueDetails + todayDetails + upcomingDetails + "</div></details>"

        } else {
            listContent += "<details open><summary><span>" + moment(currentDate).format("dddd, D") + "</span><span class='weekNr'> " + moment(currentDate).format("[W]w") + "</span></summary><div class='content'>" + setTaskContentContainer(currentDate) + "</div></details>"
        }

    }

    rootNode.querySelector("span").appendChild(dv.el("div", listContent, {
        cls: "list",
        attr: {"data-month": monthName}
    }));

    setStatisticValues(dueCounter, doneCounter, overdueCounter, startCounter, scheduledCounter, recurrenceCounter, dailyNoteCounter);
    rootNode.setAttribute("view", "list");

    // Scroll To Today If Selected Month Is Current Month
    if (moment().format(yearMonth) === moment(month).format(yearMonth)) {
        var listElement = rootNode.querySelector(".list");
        var todayElement = rootNode.querySelector(".today")
        var scrollPos = todayElement.offsetTop - todayElement.offsetHeight + 85;
        listElement.scrollTo(0, scrollPos);
    }
}
