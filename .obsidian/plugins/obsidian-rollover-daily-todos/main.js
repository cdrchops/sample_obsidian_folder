'use strict';

var obsidian = require('obsidian');

function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {'default': e};
}

var obsidian__default = /*#__PURE__*/_interopDefaultLegacy(obsidian);

function createCommonjsModule(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {},
        require: function (path, base) {
            return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    }, fn(module, module.exports), module.exports;
}

function commonjsRequire() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var main = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {value: true});


    const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
    const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
    const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
    const DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
    const DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";

    function shouldUsePeriodicNotesSettings(periodicity) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
    }

    /**
     * Read the user settings for the `daily-notes` plugin
     * to keep behavior of creating a new note in-sync.
     */
    function getDailyNoteSettings() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const {internalPlugins, plugins} = window.app;
            if (shouldUsePeriodicNotesSettings("daily")) {
                const {format, folder, template} = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
                return {
                    format: format || DEFAULT_DAILY_NOTE_FORMAT,
                    folder: folder?.trim() || "",
                    template: template?.trim() || "",
                };
            }
            // const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
            return {
                format: DEFAULT_DAILY_NOTE_FORMAT,
                folder: "calendar",
                template: "",
            };
        } catch (err) {
            console.info("No custom daily note settings found!", err);
        }
    }

    /**
     * Read the user settings for the `weekly-notes` plugin
     * to keep behavior of creating a new note in-sync.
     */
    function getWeeklyNoteSettings() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pluginManager = window.app.plugins;
            const calendarSettings = pluginManager.getPlugin("calendar")?.options;
            const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")?.settings?.weekly;
            if (shouldUsePeriodicNotesSettings("weekly")) {
                return {
                    format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                    folder: periodicNotesSettings.folder?.trim() || "",
                    template: periodicNotesSettings.template?.trim() || "",
                };
            }
            const settings = calendarSettings || {};
            return {
                format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: settings.weeklyNoteFolder?.trim() || "",
                template: settings.weeklyNoteTemplate?.trim() || "",
            };
        } catch (err) {
            console.info("No custom weekly note settings found!", err);
        }
    }

    /**
     * Read the user settings for the `periodic-notes` plugin
     * to keep behavior of creating a new note in-sync.
     */
    function getMonthlyNoteSettings() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        try {
            const settings = (shouldUsePeriodicNotesSettings("monthly") &&
                    pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
                {};
            return {
                format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
                folder: settings.folder?.trim() || "",
                template: settings.template?.trim() || "",
            };
        } catch (err) {
            console.info("No custom monthly note settings found!", err);
        }
    }

    /**
     * Read the user settings for the `periodic-notes` plugin
     * to keep behavior of creating a new note in-sync.
     */
    function getQuarterlyNoteSettings() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        try {
            const settings = (shouldUsePeriodicNotesSettings("quarterly") &&
                    pluginManager.getPlugin("periodic-notes")?.settings?.quarterly) ||
                {};
            return {
                format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
                folder: settings.folder?.trim() || "",
                template: settings.template?.trim() || "",
            };
        } catch (err) {
            console.info("No custom quarterly note settings found!", err);
        }
    }

    /**
     * Read the user settings for the `periodic-notes` plugin
     * to keep behavior of creating a new note in-sync.
     */
    function getYearlyNoteSettings() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        try {
            const settings = (shouldUsePeriodicNotesSettings("yearly") &&
                    pluginManager.getPlugin("periodic-notes")?.settings?.yearly) ||
                {};
            return {
                format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
                folder: settings.folder?.trim() || "",
                template: settings.template?.trim() || "",
            };
        } catch (err) {
            console.info("No custom yearly note settings found!", err);
        }
    }

// Credit: @creationix/path.js
    function join(...partSegments) {
        // Split the inputs into a list of path commands.
        let parts = [];
        for (let i = 0, l = partSegments.length; i < l; i++) {
            parts = parts.concat(partSegments[i].split("/"));
        }
        // Interpret the path commands to get the new resolved path.
        const newParts = [];
        for (let i = 0, l = parts.length; i < l; i++) {
            const part = parts[i];
            // Remove leading and trailing slashes
            // Also remove "." segments
            if (!part || part === ".")
                continue;
            // Push new path segments.
            else
                newParts.push(part);
        }
        // Preserve the initial slash if there was one.
        if (parts[0] === "")
            newParts.unshift("");
        // Turn back into a single string path.
        return newParts.join("/");
    }

    function basename(fullPath) {
        let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
        if (base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    async function ensureFolderExists(path) {
        const dirs = path.replace(/\\/g, "/").split("/");
        dirs.pop(); // remove basename
        if (dirs.length) {
            const dir = join(...dirs);
            if (!window.app.vault.getAbstractFileByPath(dir)) {
                await window.app.vault.createFolder(dir);
            }
        }
    }

    async function getNotePath(directory, filename) {
        if (!filename.endsWith(".md")) {
            filename += ".md";
        }
        const path = obsidian__default["default"].normalizePath(join(directory, filename));
        await ensureFolderExists(path);
        return path;
    }

    async function getTemplateInfo(template) {
        const {metadataCache, vault} = window.app;
        const templatePath = obsidian__default["default"].normalizePath(template);
        if (templatePath === "/") {
            return Promise.resolve(["", null]);
        }
        try {
            const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
            const contents = await vault.cachedRead(templateFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IFoldInfo = window.app.foldManager.load(templateFile);
            return [contents, IFoldInfo];
        } catch (err) {
            console.error(`Failed to read the daily note template '${templatePath}'`, err);
            new obsidian__default["default"].Notice("Failed to read the daily note template");
            return ["", null];
        }
    }

    /**
     * dateUID is a way of weekly identifying daily/weekly/monthly notes.
     * They are prefixed with the granularity to avoid ambiguity.
     */
    function getDateUID(date, granularity = "day") {
        const ts = date.clone().startOf(granularity).format();
        return `${granularity}-${ts}`;
    }

    function removeEscapedCharacters(format) {
        return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
    }

    /**
     * XXX: When parsing dates that contain both week numbers and months,
     * Moment choses to ignore the week numbers. For the week dateUID, we
     * want the opposite behavior. Strip the MMM from the format to patch.
     */
    function isFormatAmbiguous(format, granularity) {
        if (granularity === "week") {
            const cleanFormat = removeEscapedCharacters(format);
            return (/w{1,2}/i.test(cleanFormat) &&
                (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
        }
        return false;
    }

    function getDateFromFile(file, granularity) {
        return getDateFromFilename(file.basename, granularity);
    }

    function getDateFromPath(path, granularity) {
        return getDateFromFilename(basename(path), granularity);
    }

    function getDateFromFilename(filename, granularity) {
        const getSettings = {
            day: getDailyNoteSettings,
            week: getWeeklyNoteSettings,
            month: getMonthlyNoteSettings,
            quarter: getQuarterlyNoteSettings,
            year: getYearlyNoteSettings,
        };
        const format = getSettings[granularity]().format.split("/").pop();
        const noteDate = window.moment(filename, format, true);
        if (!noteDate.isValid()) {
            return null;
        }
        if (isFormatAmbiguous(format, granularity)) {
            if (granularity === "week") {
                const cleanFormat = removeEscapedCharacters(format);
                if (/w{1,2}/i.test(cleanFormat)) {
                    return window.moment(filename,
                        // If format contains week, remove day & month formatting
                        format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
                }
            }
        }
        return noteDate;
    }

    class DailyNotesFolderMissingError extends Error {
    }

    /**
     * This function mimics the behavior of the daily-notes plugin
     * so it will replace {{date}}, {{title}}, and {{time}} with the
     * formatted timestamp.
     *
     * Note: it has an added bonus that it's not 'today' specific.
     */
    async function createDailyNote(date) {
        const app = window.app;
        const {vault} = app;
        const moment = window.moment;
        const {template, format, folder} = getDailyNoteSettings();
        const [templateContents, IFoldInfo] = await getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = await getNotePath(folder, filename);
        try {
            const createdFile = await vault.create(normalizedPath, templateContents
                .replace(/{{\s*date\s*}}/gi, filename)
                .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
                .replace(/{{\s*title\s*}}/gi, filename)
                .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                    const now = moment();
                    const currentDate = date.clone().set({
                        hour: now.get("hour"),
                        minute: now.get("minute"),
                        second: now.get("second"),
                    });
                    if (calc) {
                        currentDate.add(parseInt(timeDelta, 10), unit);
                    }
                    if (momentFormat) {
                        return currentDate.format(momentFormat.substring(1).trim());
                    }
                    return currentDate.format(format);
                })
                .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
                .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            app.foldManager.save(createdFile, IFoldInfo);
            return createdFile;
        } catch (err) {
            console.error(`Failed to create file: '${normalizedPath}'`, err);
            new obsidian__default["default"].Notice("Unable to create new file.");
        }
    }

    function getDailyNote(date, dailyNotes) {
        return dailyNotes[getDateUID(date, "day")] ?? null;
    }

    function getAllDailyNotes() {
        /**
         * Find all daily notes in the daily note folder
         */
        const {vault} = window.app;
        const {folder} = getDailyNoteSettings();
        const dailyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
        if (!dailyNotesFolder) {
            throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
        }
        const dailyNotes = {};
        obsidian__default["default"].Vault.recurseChildren(dailyNotesFolder, (note) => {
            if (note instanceof obsidian__default["default"].TFile) {
                const date = getDateFromFile(note, "day");
                if (date) {
                    const dateString = getDateUID(date, "day");
                    dailyNotes[dateString] = note;
                }
            }
        });
        return dailyNotes;
    }

    class WeeklyNotesFolderMissingError extends Error {
    }

    function getDaysOfWeek() {
        const {moment} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let weekStart = moment.localeData()._week.dow;
        const daysOfWeek = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        while (weekStart) {
            daysOfWeek.push(daysOfWeek.shift());
            weekStart--;
        }
        return daysOfWeek;
    }

    function getDayOfWeekNumericalValue(dayOfWeekName) {
        return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
    }

    async function createWeeklyNote(date) {
        const {vault} = window.app;
        const {template, format, folder} = getWeeklyNoteSettings();
        const [templateContents, IFoldInfo] = await getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = await getNotePath(folder, filename);
        try {
            const createdFile = await vault.create(normalizedPath, templateContents
                .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                    const now = window.moment();
                    const currentDate = date.clone().set({
                        hour: now.get("hour"),
                        minute: now.get("minute"),
                        second: now.get("second"),
                    });
                    if (calc) {
                        currentDate.add(parseInt(timeDelta, 10), unit);
                    }
                    if (momentFormat) {
                        return currentDate.format(momentFormat.substring(1).trim());
                    }
                    return currentDate.format(format);
                })
                .replace(/{{\s*title\s*}}/gi, filename)
                .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
                .replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
                    const day = getDayOfWeekNumericalValue(dayOfWeek);
                    return date.weekday(day).format(momentFormat.trim());
                }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.app.foldManager.save(createdFile, IFoldInfo);
            return createdFile;
        } catch (err) {
            console.error(`Failed to create file: '${normalizedPath}'`, err);
            new obsidian__default["default"].Notice("Unable to create new file.");
        }
    }

    function getWeeklyNote(date, weeklyNotes) {
        return weeklyNotes[getDateUID(date, "week")] ?? null;
    }

    function getAllWeeklyNotes() {
        const weeklyNotes = {};
        if (!appHasWeeklyNotesPluginLoaded()) {
            return weeklyNotes;
        }
        const {vault} = window.app;
        const {folder} = getWeeklyNoteSettings();
        const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
        if (!weeklyNotesFolder) {
            throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
        }
        obsidian__default["default"].Vault.recurseChildren(weeklyNotesFolder, (note) => {
            if (note instanceof obsidian__default["default"].TFile) {
                const date = getDateFromFile(note, "week");
                if (date) {
                    const dateString = getDateUID(date, "week");
                    weeklyNotes[dateString] = note;
                }
            }
        });
        return weeklyNotes;
    }

    class MonthlyNotesFolderMissingError extends Error {
    }

    /**
     * This function mimics the behavior of the daily-notes plugin
     * so it will replace {{date}}, {{title}}, and {{time}} with the
     * formatted timestamp.
     *
     * Note: it has an added bonus that it's not 'today' specific.
     */
    async function createMonthlyNote(date) {
        const {vault} = window.app;
        const {template, format, folder} = getMonthlyNoteSettings();
        const [templateContents, IFoldInfo] = await getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = await getNotePath(folder, filename);
        try {
            const createdFile = await vault.create(normalizedPath, templateContents
                .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                    const now = window.moment();
                    const currentDate = date.clone().set({
                        hour: now.get("hour"),
                        minute: now.get("minute"),
                        second: now.get("second"),
                    });
                    if (calc) {
                        currentDate.add(parseInt(timeDelta, 10), unit);
                    }
                    if (momentFormat) {
                        return currentDate.format(momentFormat.substring(1).trim());
                    }
                    return currentDate.format(format);
                })
                .replace(/{{\s*date\s*}}/gi, filename)
                .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
                .replace(/{{\s*title\s*}}/gi, filename));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.app.foldManager.save(createdFile, IFoldInfo);
            return createdFile;
        } catch (err) {
            console.error(`Failed to create file: '${normalizedPath}'`, err);
            new obsidian__default["default"].Notice("Unable to create new file.");
        }
    }

    function getMonthlyNote(date, monthlyNotes) {
        return monthlyNotes[getDateUID(date, "month")] ?? null;
    }

    function getAllMonthlyNotes() {
        const monthlyNotes = {};
        if (!appHasMonthlyNotesPluginLoaded()) {
            return monthlyNotes;
        }
        const {vault} = window.app;
        const {folder} = getMonthlyNoteSettings();
        const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
        if (!monthlyNotesFolder) {
            throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
        }
        obsidian__default["default"].Vault.recurseChildren(monthlyNotesFolder, (note) => {
            if (note instanceof obsidian__default["default"].TFile) {
                const date = getDateFromFile(note, "month");
                if (date) {
                    const dateString = getDateUID(date, "month");
                    monthlyNotes[dateString] = note;
                }
            }
        });
        return monthlyNotes;
    }

    class QuarterlyNotesFolderMissingError extends Error {
    }

    /**
     * This function mimics the behavior of the daily-notes plugin
     * so it will replace {{date}}, {{title}}, and {{time}} with the
     * formatted timestamp.
     *
     * Note: it has an added bonus that it's not 'today' specific.
     */
    async function createQuarterlyNote(date) {
        const {vault} = window.app;
        const {template, format, folder} = getQuarterlyNoteSettings();
        const [templateContents, IFoldInfo] = await getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = await getNotePath(folder, filename);
        try {
            const createdFile = await vault.create(normalizedPath, templateContents
                .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                    const now = window.moment();
                    const currentDate = date.clone().set({
                        hour: now.get("hour"),
                        minute: now.get("minute"),
                        second: now.get("second"),
                    });
                    if (calc) {
                        currentDate.add(parseInt(timeDelta, 10), unit);
                    }
                    if (momentFormat) {
                        return currentDate.format(momentFormat.substring(1).trim());
                    }
                    return currentDate.format(format);
                })
                .replace(/{{\s*date\s*}}/gi, filename)
                .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
                .replace(/{{\s*title\s*}}/gi, filename));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.app.foldManager.save(createdFile, IFoldInfo);
            return createdFile;
        } catch (err) {
            console.error(`Failed to create file: '${normalizedPath}'`, err);
            new obsidian__default["default"].Notice("Unable to create new file.");
        }
    }

    function getQuarterlyNote(date, quarterly) {
        return quarterly[getDateUID(date, "quarter")] ?? null;
    }

    function getAllQuarterlyNotes() {
        const quarterly = {};
        if (!appHasQuarterlyNotesPluginLoaded()) {
            return quarterly;
        }
        const {vault} = window.app;
        const {folder} = getQuarterlyNoteSettings();
        const quarterlyFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
        if (!quarterlyFolder) {
            throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
        }
        obsidian__default["default"].Vault.recurseChildren(quarterlyFolder, (note) => {
            if (note instanceof obsidian__default["default"].TFile) {
                const date = getDateFromFile(note, "quarter");
                if (date) {
                    const dateString = getDateUID(date, "quarter");
                    quarterly[dateString] = note;
                }
            }
        });
        return quarterly;
    }

    class YearlyNotesFolderMissingError extends Error {
    }

    /**
     * This function mimics the behavior of the daily-notes plugin
     * so it will replace {{date}}, {{title}}, and {{time}} with the
     * formatted timestamp.
     *
     * Note: it has an added bonus that it's not 'today' specific.
     */
    async function createYearlyNote(date) {
        const {vault} = window.app;
        const {template, format, folder} = getYearlyNoteSettings();
        const [templateContents, IFoldInfo] = await getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = await getNotePath(folder, filename);
        try {
            const createdFile = await vault.create(normalizedPath, templateContents
                .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                    const now = window.moment();
                    const currentDate = date.clone().set({
                        hour: now.get("hour"),
                        minute: now.get("minute"),
                        second: now.get("second"),
                    });
                    if (calc) {
                        currentDate.add(parseInt(timeDelta, 10), unit);
                    }
                    if (momentFormat) {
                        return currentDate.format(momentFormat.substring(1).trim());
                    }
                    return currentDate.format(format);
                })
                .replace(/{{\s*date\s*}}/gi, filename)
                .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
                .replace(/{{\s*title\s*}}/gi, filename));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.app.foldManager.save(createdFile, IFoldInfo);
            return createdFile;
        } catch (err) {
            console.error(`Failed to create file: '${normalizedPath}'`, err);
            new obsidian__default["default"].Notice("Unable to create new file.");
        }
    }

    function getYearlyNote(date, yearlyNotes) {
        return yearlyNotes[getDateUID(date, "year")] ?? null;
    }

    function getAllYearlyNotes() {
        const yearlyNotes = {};
        if (!appHasYearlyNotesPluginLoaded()) {
            return yearlyNotes;
        }
        const {vault} = window.app;
        const {folder} = getYearlyNoteSettings();
        const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
        if (!yearlyNotesFolder) {
            throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
        }
        obsidian__default["default"].Vault.recurseChildren(yearlyNotesFolder, (note) => {
            if (note instanceof obsidian__default["default"].TFile) {
                const date = getDateFromFile(note, "year");
                if (date) {
                    const dateString = getDateUID(date, "year");
                    yearlyNotes[dateString] = note;
                }
            }
        });
        return yearlyNotes;
    }

    function appHasDailyNotesPluginLoaded() {
        const {app} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
        if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
            return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.daily?.enabled;
    }

    /**
     * XXX: "Weekly Notes" live in either the Calendar plugin or the periodic-notes plugin.
     * Check both until the weekly notes feature is removed from the Calendar plugin.
     */
    function appHasWeeklyNotesPluginLoaded() {
        const {app} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (app.plugins.getPlugin("calendar")) {
            return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.weekly?.enabled;
    }

    function appHasMonthlyNotesPluginLoaded() {
        const {app} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.monthly?.enabled;
    }

    function appHasQuarterlyNotesPluginLoaded() {
        const {app} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.quarterly?.enabled;
    }

    function appHasYearlyNotesPluginLoaded() {
        const {app} = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodicNotes = app.plugins.getPlugin("periodic-notes");
        return periodicNotes && periodicNotes.settings?.yearly?.enabled;
    }

    function getPeriodicNoteSettings(granularity) {
        const getSettings = {
            day: getDailyNoteSettings,
            week: getWeeklyNoteSettings,
            month: getMonthlyNoteSettings,
            quarter: getQuarterlyNoteSettings,
            year: getYearlyNoteSettings,
        }[granularity];
        return getSettings();
    }

    function createPeriodicNote(granularity, date) {
        const createFn = {
            day: createDailyNote,
            month: createMonthlyNote,
            week: createWeeklyNote,
        };
        return createFn[granularity](date);
    }

    exports.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
    exports.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
    exports.DEFAULT_QUARTERLY_NOTE_FORMAT = DEFAULT_QUARTERLY_NOTE_FORMAT;
    exports.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
    exports.DEFAULT_YEARLY_NOTE_FORMAT = DEFAULT_YEARLY_NOTE_FORMAT;
    exports.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
    exports.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
    exports.appHasQuarterlyNotesPluginLoaded = appHasQuarterlyNotesPluginLoaded;
    exports.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
    exports.appHasYearlyNotesPluginLoaded = appHasYearlyNotesPluginLoaded;
    exports.createDailyNote = createDailyNote;
    exports.createMonthlyNote = createMonthlyNote;
    exports.createPeriodicNote = createPeriodicNote;
    exports.createQuarterlyNote = createQuarterlyNote;
    exports.createWeeklyNote = createWeeklyNote;
    exports.createYearlyNote = createYearlyNote;
    exports.getAllDailyNotes = getAllDailyNotes;
    exports.getAllMonthlyNotes = getAllMonthlyNotes;
    exports.getAllQuarterlyNotes = getAllQuarterlyNotes;
    exports.getAllWeeklyNotes = getAllWeeklyNotes;
    exports.getAllYearlyNotes = getAllYearlyNotes;
    exports.getDailyNote = getDailyNote;
    exports.getDailyNoteSettings = getDailyNoteSettings;
    exports.getDateFromFile = getDateFromFile;
    exports.getDateFromPath = getDateFromPath;
    exports.getDateUID = getDateUID;
    exports.getMonthlyNote = getMonthlyNote;
    exports.getMonthlyNoteSettings = getMonthlyNoteSettings;
    exports.getPeriodicNoteSettings = getPeriodicNoteSettings;
    exports.getQuarterlyNote = getQuarterlyNote;
    exports.getQuarterlyNoteSettings = getQuarterlyNoteSettings;
    exports.getTemplateInfo = getTemplateInfo;
    exports.getWeeklyNote = getWeeklyNote;
    exports.getWeeklyNoteSettings = getWeeklyNoteSettings;
    exports.getYearlyNote = getYearlyNote;
    exports.getYearlyNoteSettings = getYearlyNoteSettings;
});

class UndoModal extends obsidian.Modal {
    constructor(plugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    async parseDay(day) {
        const {file, oldContent} = day;
        let currentContent = await this.plugin.app.vault.read(file);

        const oldContentLineCount = oldContent.split('\n').length;
        const currentContentLineCount = currentContent.split('\n').length;
        const diff = Math.abs(oldContentLineCount - currentContentLineCount);

        let s = '';
        if (oldContentLineCount > currentContentLineCount) {
            s = `- ${file.basename}.${file.extension}: add ${diff} line${diff.length > 1 ? 's' : ''}.`;
        } else if (oldContentLineCount < currentContentLineCount) {
            s = `- ${file.basename}.${file.extension}: remove ${diff} line${diff.length > 1 ? 's' : ''}.`;
        } else {
            if (oldContent == currentContent) {
                s = `- ${file.basename}.${file.extension}: will not be modified.`;
            } else {
                s = `- ${file.basename}.${file.extension}: will be modified to its previous state, with the same number of lines (but different content).`;
            }
        }

        return s
    }

    async confirmUndo(undoHistoryInstance) {
        await this.plugin.app.vault.modify(undoHistoryInstance.today.file, undoHistoryInstance.today.oldContent);
        if (undoHistoryInstance.previousDay.file != undefined) {
            await this.plugin.app.vault.modify(undoHistoryInstance.previousDay.file, undoHistoryInstance.previousDay.oldContent);
        }
        this.plugin.undoHistory = [];
    }

    async onOpen() {
        let {contentEl, plugin} = this;
        contentEl.createEl('h3', {text: 'Undo last rollover'});
        contentEl.createEl('div', {text: 'A single rollover command can be undone, which will load the state of the two files modified (or 1 if the delete option is toggled off) before the rollover first occurred. Any text you may have added from those file(s) during that time may be deleted.'});
        contentEl.createEl('div', {text: 'Note that rollover actions can only be undone for up to 2 minutes after the command occurred, and will be removed from history if the app closes.'});
        contentEl.createEl('h4', {text: 'Changes made with undo:'});

        const undoHistoryInstance = plugin.undoHistory[0];
        let modTextArray = [await this.parseDay(undoHistoryInstance.today)];
        if (undoHistoryInstance.previousDay.file != undefined) {
            modTextArray.push(await this.parseDay(undoHistoryInstance.previousDay));
        }
        modTextArray.forEach(txt => {
            contentEl.createEl('div', {text: txt});
        });

        new obsidian.Setting(contentEl)
            .addButton(button => button
                .setButtonText('Confirm Undo')
                .onClick(async (e) => {
                    await this.confirmUndo(undoHistoryInstance);
                    this.close();
                })
            );
    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}

class RolloverSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async getTemplateHeadings() {
        const {template} = main.getDailyNoteSettings();
        if (!template) return [];

        let file = this.app.vault.getAbstractFileByPath(template);

        if (file === null) {
            file = this.app.vault.getAbstractFileByPath(template + ".md");
        }

        if (file === null) {
            // file not available, no template-heading can be returned
            return [];
        }

        const templateContents = await this.app.vault.read(file);
        const allHeadings = Array.from(templateContents.matchAll(/#{1,} .*/g)).map(
            ([heading]) => heading
        );
        return allHeadings;
    }

    async display() {
        const templateHeadings = await this.getTemplateHeadings();

        this.containerEl.empty();
        new obsidian.Setting(this.containerEl)
            .setName("Template heading")
            .setDesc("Which heading from your template should the todos go under")
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions({
                        ...templateHeadings.reduce((acc, heading) => {
                            acc[heading] = heading;
                            return acc;
                        }, {}),
                        none: "None",
                    })
                    .setValue(this.plugin?.settings.templateHeading)
                    .onChange((value) => {
                        this.plugin.settings.templateHeading = value;
                        this.plugin.saveSettings();
                    })
            );

        new obsidian.Setting(this.containerEl)
            .setName("Delete todos from previous day")
            .setDesc(
                `Once todos are found, they are added to Today's Daily Note. If successful, they are deleted from Yesterday's Daily note. Enabling this is destructive and may result in lost data. Keeping this disabled will simply duplicate them from yesterday's note and place them in the appropriate section. Note that currently, duplicate todos will be deleted regardless of what heading they are in, and which heading you choose from above.`
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.deleteOnComplete || false)
                    .onChange((value) => {
                        this.plugin.settings.deleteOnComplete = value;
                        this.plugin.saveSettings();
                    })
            );

        new obsidian.Setting(this.containerEl)
            .setName("Remove empty todos in rollover")
            .setDesc(
                `If you have empty todos, they will not be rolled over to the next day.`
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.removeEmptyTodos || false)
                    .onChange((value) => {
                        this.plugin.settings.removeEmptyTodos = value;
                        this.plugin.saveSettings();
                    })
            );

        new obsidian.Setting(this.containerEl)
            .setName("Roll over children of todos")
            .setDesc(
                `By default, only the actual todos are rolled over. If you add nested Markdown-elements beneath your todos, these are not rolled over but stay in place, possibly altering the logic of your previous note. This setting allows for also migrating the nested elements.`
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.rolloverChildren || false)
                    .onChange((value) => {
                        this.plugin.settings.rolloverChildren = value;
                        this.plugin.saveSettings();
                    })
            );

        new obsidian.Setting(this.containerEl)
            .setName("Automatic rollover on daily note open")
            .setDesc(
                `If enabled, the plugin will automatically rollover todos when you open a daily note.`
            )
            .addToggle((toggle) =>
                toggle
                    // Default to true if the setting is not set
                    .setValue(
                        this.plugin.settings.rolloverOnFileCreate === undefined ||
                        this.plugin.settings.rolloverOnFileCreate === null
                            ? true
                            : this.plugin.settings.rolloverOnFileCreate
                    )
                    .onChange((value) => {
                        console.log(value);
                        this.plugin.settings.rolloverOnFileCreate = value;
                        this.plugin.saveSettings();
                        this.plugin.loadData().then((value) => console.log(value));
                    })
            );
    }
}

class TodoParser {
    // Support all unordered list bullet symbols as per spec (https://daringfireball.net/projects/markdown/syntax#list)
    bulletSymbols = ["-", "*", "+"];

    // List of strings that include the Markdown content
    #lines;

    // Boolean that encodes whether nested items should be rolled over
    #withChildren;

    constructor(lines, withChildren) {
        this.#lines = lines;
        this.#withChildren = withChildren;
    }

    // Returns true if string s is a todo-item
    #isTodo(s) {
        const r = new RegExp(`\\s*[${this.bulletSymbols.join("")}] \\[[^xX-]\\].*`, "g"); // /\s*[-*+] \[[^xX-]\].*/g;
        return r.test(s);
    }

    // Returns true if line after line-number `l` is a nested item
    #hasChildren(l) {
        if (l + 1 >= this.#lines.length) {
            return false;
        }
        const indCurr = this.#getIndentation(l);
        const indNext = this.#getIndentation(l + 1);
        if (indNext > indCurr) {
            return true;
        }
        return false;
    }

    // Returns a list of strings that are the nested items after line `parentLinum`
    #getChildren(parentLinum) {
        const children = [];
        let nextLinum = parentLinum + 1;
        while (this.#isChildOf(parentLinum, nextLinum)) {
            children.push(this.#lines[nextLinum]);
            nextLinum++;
        }
        return children;
    }

    // Returns true if line `linum` has more indentation than line `parentLinum`
    #isChildOf(parentLinum, linum) {
        if (parentLinum >= this.#lines.length || linum >= this.#lines.length) {
            return false;
        }
        return this.#getIndentation(linum) > this.#getIndentation(parentLinum);
    }

    // Returns the number of whitespace-characters at beginning of string at line `l`
    #getIndentation(l) {
        return this.#lines[l].search(/\S/);
    }

    // Returns a list of strings that represents all the todos along with their potential children
    getTodos() {
        let todos = [];
        for (let l = 0; l < this.#lines.length; l++) {
            const line = this.#lines[l];
            if (this.#isTodo(line)) {
                todos.push(line);
                if (this.#withChildren && this.#hasChildren(l)) {
                    const cs = this.#getChildren(l);
                    todos = [...todos, ...cs];
                    l += cs.length;
                }
            }
        }
        return todos;
    }
}

// Utility-function that acts as a thin wrapper around `TodoParser`
const getTodos = ({lines, withChildren = false}) => {
    const todoParser = new TodoParser(lines, withChildren);
    return todoParser.getTodos();
};

const MAX_TIME_SINCE_CREATION = 5000; // 5 seconds

/* Just some boilerplate code for recursively going through subheadings for later
function createRepresentationFromHeadings(headings) {
  let i = 0;
  const tags = [];

  (function recurse(depth) {
    let unclosedLi = false;
    while (i < headings.length) {
      const [hashes, data] = headings[i].split("# ");
      if (hashes.length < depth) {
        break;
      } else if (hashes.length === depth) {
        if (unclosedLi) tags.push('</li>');
        unclosedLi = true;
        tags.push('<li>', data);
        i++;
      } else {
        tags.push('<ul>');
        recurse(depth + 1);
        tags.push('</ul>');
      }
    }
    if (unclosedLi) tags.push('</li>');
  })(-1);
  return tags.join('\n');
}
*/

class RolloverTodosPlugin extends obsidian.Plugin {
    async loadSettings() {
        const DEFAULT_SETTINGS = {
            templateHeading: "none",
            deleteOnComplete: false,
            removeEmptyTodos: false,
            rolloverChildren: false,
            rolloverOnFileCreate: true,
        };
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    isDailyNotesEnabled() {
        const dailyNotesPlugin = this.app.internalPlugins.plugins["daily-notes"];
        const dailyNotesEnabled = dailyNotesPlugin && dailyNotesPlugin.enabled;

        const periodicNotesPlugin = this.app.plugins.getPlugin("periodic-notes");
        const periodicNotesEnabled =
            periodicNotesPlugin && periodicNotesPlugin.settings?.daily?.enabled;

        return dailyNotesEnabled || periodicNotesEnabled;
    }

    getLastDailyNote() {
        const {moment} = window;
        let {folder, format} = main.getDailyNoteSettings();

        folder = this.getCleanFolder(folder);
        folder = folder.length === 0 ? folder : folder + "/";

        const dailyNoteRegexMatch = new RegExp("^" + folder + "(.*).md$");
        const todayMoment = moment();

        // get all notes in directory that aren't null
        const dailyNoteFiles = this.app.vault
            .getMarkdownFiles()
            .filter((file) => file.path.startsWith(folder))
            .filter((file) =>
                moment(
                    file.path.replace(dailyNoteRegexMatch, "$1"),
                    format,
                    true
                ).isValid()
            )
            .filter((file) => file.basename)
            .filter((file) =>
                this.getFileMoment(file, folder, format).isSameOrBefore(
                    todayMoment,
                    "day"
                )
            );

        // sort by date
        const sorted = dailyNoteFiles.sort(
            (a, b) =>
                this.getFileMoment(b, folder, format).valueOf() -
                this.getFileMoment(a, folder, format).valueOf()
        );
        return sorted[1];
    }

    getFileMoment(file, folder, format) {
        let path = file.path;

        if (path.startsWith(folder)) {
            // Remove length of folder from start of path
            path = path.substring(folder.length);
        }

        if (path.endsWith(`.${file.extension}`)) {
            // Remove length of file extension from end of path
            path = path.substring(0, path.length - file.extension.length - 1);
        }

        return moment(path, format);
    }

    async getAllUnfinishedTodos(file) {
        const dn = await this.app.vault.read(file);
        const dnLines = dn.split(/\r?\n|\r|\n/g);

        return getTodos({
            lines: dnLines,
            withChildren: this.settings.rolloverChildren,
        });
    }

    async sortHeadersIntoHierarchy(file) {
        ///console.log('testing')
        const templateContents = await this.app.vault.read(file);
        const allHeadings = Array.from(templateContents.matchAll(/#{1,} .*/g)).map(
            ([heading]) => heading
        );

        if (allHeadings.length > 0) {
            console.log(createRepresentationFromHeadings(allHeadings));
        }
    }

    getCleanFolder(folder) {
        // Check if user defined folder with root `/` e.g. `/dailies`
        if (folder.startsWith("/")) {
            folder = folder.substring(1);
        }

        // Check if user defined folder with trailing `/` e.g. `dailies/`
        if (folder.endsWith("/")) {
            folder = folder.substring(0, folder.length - 1);
        }

        return folder;
    }

    async rollover(file = undefined) {
        /*** First we check if the file created is actually a valid daily note ***/
        let {folder, format} = main.getDailyNoteSettings();
        let ignoreCreationTime = false;

        // Rollover can be called, but we need to get the daily file
        if (file == undefined) {
            const allDailyNotes = main.getAllDailyNotes();
            file = main.getDailyNote(window.moment(), allDailyNotes);
            ignoreCreationTime = true;
        }
        if (!file) return;

        folder = this.getCleanFolder(folder);

        // is a daily note
        if (!file.path.startsWith(folder)) return;

        // is today's daily note
        const today = new Date();
        const todayFormatted = window.moment(today).format(format);
        const filePathConstructed = `${folder}${
            folder == "" ? "" : "/"
        }${todayFormatted}.${file.extension}`;
        if (filePathConstructed !== file.path) return;

        // was just created
        if (
            today.getTime() - file.stat.ctime > MAX_TIME_SINCE_CREATION &&
            !ignoreCreationTime
        )
            return;

        /*** Next, if it is a valid daily note, but we don't have daily notes enabled, we must alert the user ***/
        if (!this.isDailyNotesEnabled()) {
            new obsidian.Notice(
                "RolloverTodosPlugin unable to rollover unfinished todos: Please enable Daily Notes, or Periodic Notes (with daily notes enabled).",
                10000
            );
        } else {
            const {templateHeading, deleteOnComplete, removeEmptyTodos} =
                this.settings;

            // check if there is a daily note from yesterday
            const lastDailyNote = this.getLastDailyNote();
            if (!lastDailyNote) return;

            // TODO: Rollover to subheadings (optional)
            //this.sortHeadersIntoHierarchy(lastDailyNote)

            // get unfinished todos from yesterday, if exist
            let todos_yesterday = await this.getAllUnfinishedTodos(lastDailyNote);

            console.log(
                `rollover-daily-todos: ${todos_yesterday.length} todos found in ${lastDailyNote.basename}.md`
            );

            if (todos_yesterday.length == 0) {
                return;
            }

            // setup undo history
            let undoHistoryInstance = {
                previousDay: {
                    file: undefined,
                    oldContent: "",
                },
                today: {
                    file: undefined,
                    oldContent: "",
                },
            };

            // Potentially filter todos from yesterday for today
            let todosAdded = 0;
            let emptiesToNotAddToTomorrow = 0;
            let todos_today = !removeEmptyTodos ? todos_yesterday : [];
            if (removeEmptyTodos) {
                todos_yesterday.forEach((line, i) => {
                    const trimmedLine = (line || "").trim();
                    if (trimmedLine != "- [ ]" && trimmedLine != "- [  ]") {
                        todos_today.push(line);
                        todosAdded++;
                    } else {
                        emptiesToNotAddToTomorrow++;
                    }
                });
            } else {
                todosAdded = todos_yesterday.length;
            }

            // get today's content and modify it
            let templateHeadingNotFoundMessage = "";
            const templateHeadingSelected = templateHeading !== "none";

            if (todos_today.length > 0) {
                let dailyNoteContent = await this.app.vault.read(file);
                undoHistoryInstance.today = {
                    file: file,
                    oldContent: `${dailyNoteContent}`,
                };
                const todos_todayString = `\n${todos_today.join("\n")}`;

                // If template heading is selected, try to rollover to template heading
                if (templateHeadingSelected) {
                    const contentAddedToHeading = dailyNoteContent.replace(
                        templateHeading,
                        `${templateHeading}${todos_todayString}`
                    );
                    if (contentAddedToHeading == dailyNoteContent) {
                        templateHeadingNotFoundMessage = `Rollover couldn't find '${templateHeading}' in today's daily not. Rolling todos to end of file.`;
                    } else {
                        dailyNoteContent = contentAddedToHeading;
                    }
                }

                // Rollover to bottom of file if no heading found in file, or no heading selected
                if (
                    !templateHeadingSelected ||
                    templateHeadingNotFoundMessage.length > 0
                ) {
                    dailyNoteContent += todos_todayString;
                }

                await this.app.vault.modify(file, dailyNoteContent);
            }

            // if deleteOnComplete, get yesterday's content and modify it
            if (deleteOnComplete) {
                let lastDailyNoteContent = await this.app.vault.read(lastDailyNote);
                undoHistoryInstance.previousDay = {
                    file: lastDailyNote,
                    oldContent: `${lastDailyNoteContent}`,
                };
                let lines = lastDailyNoteContent.split("\n");

                for (let i = lines.length; i >= 0; i--) {
                    if (todos_yesterday.includes(lines[i])) {
                        lines.splice(i, 1);
                    }
                }

                const modifiedContent = lines.join("\n");
                await this.app.vault.modify(lastDailyNote, modifiedContent);
            }

            // Let user know rollover has been successful with X todos
            const todosAddedString =
                todosAdded == 0
                    ? ""
                    : `- ${todosAdded} todo${todosAdded > 1 ? "s" : ""} rolled over.`;
            const emptiesToNotAddToTomorrowString =
                emptiesToNotAddToTomorrow == 0
                    ? ""
                    : deleteOnComplete
                        ? `- ${emptiesToNotAddToTomorrow} empty todo${
                            emptiesToNotAddToTomorrow > 1 ? "s" : ""
                        } removed.`
                        : "";
            const part1 =
                templateHeadingNotFoundMessage.length > 0
                    ? `${templateHeadingNotFoundMessage}`
                    : "";
            const part2 = `${todosAddedString}${
                todosAddedString.length > 0 ? " " : ""
            }`;
            const part3 = `${emptiesToNotAddToTomorrowString}${
                emptiesToNotAddToTomorrowString.length > 0 ? " " : ""
            }`;

            let allParts = [part1, part2, part3];
            let nonBlankLines = [];
            allParts.forEach((part) => {
                if (part.length > 0) {
                    nonBlankLines.push(part);
                }
            });

            const message = nonBlankLines.join("\n");
            if (message.length > 0) {
                new obsidian.Notice(message, 4000 + message.length * 3);
            }
            this.undoHistoryTime = new Date();
            this.undoHistory = [undoHistoryInstance];
        }
    }

    async onload() {
        await this.loadSettings();
        this.undoHistory = [];
        this.undoHistoryTime = new Date();

        this.addSettingTab(new RolloverSettingTab(this.app, this));

        this.registerEvent(
            this.app.vault.on("create", async (file) => {
                // Check if automatic daily note creation is enabled
                if (!this.settings.rolloverOnFileCreate) return;
                this.rollover(file);
            })
        );

        this.addCommand({
            id: "obsidian-rollover-daily-todos-rollover",
            name: "Rollover Todos Now",
            callback: () => {
                this.rollover();
            },
        });

        this.addCommand({
            id: "obsidian-rollover-daily-todos-undo",
            name: "Undo last rollover",
            checkCallback: (checking) => {
                // no history, don't allow undo
                if (this.undoHistory.length > 0) {
                    const now = window.moment();
                    const lastUse = window.moment(this.undoHistoryTime);
                    const diff = now.diff(lastUse, "seconds");
                    // 2+ mins since use: don't allow undo
                    if (diff > 2 * 60) {
                        return false;
                    }
                    if (!checking) {
                        new UndoModal(this).open();
                    }
                    return true;
                }
                return false;
            },
        });
    }
}

module.exports = RolloverTodosPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL29ic2lkaWFuLWRhaWx5LW5vdGVzLWludGVyZmFjZUAwLjkuNC9ub2RlX21vZHVsZXMvb2JzaWRpYW4tZGFpbHktbm90ZXMtaW50ZXJmYWNlL2Rpc3QvbWFpbi5qcyIsInNyYy91aS9VbmRvTW9kYWwuanMiLCJzcmMvdWkvUm9sbG92ZXJTZXR0aW5nVGFiLmpzIiwic3JjL2dldC10b2Rvcy5qcyIsInNyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsib2JzaWRpYW4iLCJNb2RhbCIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIiwiZ2V0RGFpbHlOb3RlU2V0dGluZ3MiLCJQbHVnaW4iLCJnZXRBbGxEYWlseU5vdGVzIiwiZ2V0RGFpbHlOb3RlIiwiTm90aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0EsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUQ7QUFDbUM7QUFDbkM7QUFDQSxNQUFNLHlCQUF5QixHQUFHLFlBQVksQ0FBQztBQUMvQyxNQUFNLDBCQUEwQixHQUFHLFlBQVksQ0FBQztBQUNoRCxNQUFNLDJCQUEyQixHQUFHLFNBQVMsQ0FBQztBQUM5QyxNQUFNLDZCQUE2QixHQUFHLFdBQVcsQ0FBQztBQUNsRCxNQUFNLDBCQUEwQixHQUFHLE1BQU0sQ0FBQztBQUMxQztBQUNBLFNBQVMsOEJBQThCLENBQUMsV0FBVyxFQUFFO0FBQ3JEO0FBQ0EsSUFBSSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN6RSxJQUFJLE9BQU8sYUFBYSxJQUFJLGFBQWEsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEVBQUUsT0FBTyxDQUFDO0FB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
