---
title: Homepage
dateCreated: 12Jun25T08:46:23
dateModified: 12Jun25T07:25:44
---

[[My Approach]]

This is a quick sample of how I put together my index pages... this isn't a superb example.  To use this just copy the TEMP file into your obsidian vault.

The first example [[DrugsIndex]] is using dataview for a Drugs Index page.  I have a folder with all of the drugs I either need to remember, want to remember, and/or are going into a book I'm writing.  The data is pretty straight forward and uses tags in the body to be able to show in a dataview table.

The second example [[Research Index]] is how you can organize your research according to common headings.  Not all of the headings need to be used and you can have some notes with more headings.  This is how I will sometimes start piecing together information to write a paper.  I have also used atomic notes for this, I haven't mastered that and so I don't use it as often as I could.

The third example [[Research Index 2]] is how you can make notes about specific elements and bring them together into one note.  I might use this method if I'm just mad dashing through some research items or I find something that looks interesting, but I don't have enough for a full topic.  Maybe the 1st page contains some images of a VIIC and maybe the 2nd page contains some images of a IX.  Those pages may actually aggregate in a dataview the other elements.

```dataview
TABLE WITHOUT ID
  file.link as "Note"
from #daily-log
WHERE file.name = dateformat(this.file.mday, "ddMMMyy")
```

# Weather

```dataviewjs

let globalData = fetch(`https://api.weather.gov/points/37.0494,-93.2483`)
    .then((response) => response.json())
    .catch(error => console.error('Error fetching point data:', error));

const link = await globalData;

// Fetch the forecast data from the forecast URL
let forecastData = fetch(link.properties.forecast)
    .then((response) => response.json())
    .catch(error => console.error('Error fetching forecast:', error));

const forecast = await forecastData;

// Extract the forecast for the next few days (e.g., first 6 periods, covering ~3 days)
const todayForecast = forecast.properties.periods[0];

// Build the output for each forecast period
let output = "**Weather Forecast for the Next Few Days**:\n";
// Display the forecast details
dv.paragraph(`
    **Today's Forecast**:
    - **Name**: ${todayForecast.name}
    - **Temperature**: ${todayForecast.temperature} ${todayForecast.temperatureUnit}
    - **Summary**: ${todayForecast.shortForecast}
    - **Detailed Forecast**: ${todayForecast.detailedForecast}`);
```

# Weather Forecast For Week

```dataviewjs

let globalData = fetch(`https://api.weather.gov/points/37.0494,-93.2483`)
    .then((response) => response.json())
    .catch(error => console.error('Error fetching point data:', error));

const link = await globalData;

// Fetch the forecast data from the forecast URL
let forecastData = fetch(link.properties.forecast)
    .then((response) => response.json())
    .catch(error => console.error('Error fetching forecast:', error));

const forecast = await forecastData;

// Extract the forecast for the next few days (e.g., first 6 periods, covering ~3 days)
const upcomingForecasts = forecast.properties.periods.slice(0, 6);

// Build the output for each forecast period
let output = "**Weather Forecast for the Next Few Days**:\n";
upcomingForecasts.forEach((period, index) => {
    output += `
    **${period.name}**:
    - **Temperature**: ${period.temperature} ${period.temperatureUnit}
    - **Summary**: ${period.shortForecast}
    - **Detailed Forecast**: ${period.detailedForecast}
    ${index < upcomingForecasts.length - 1 ? "---" : ""}\n`;
});

// Display the forecast
dv.paragraph(output);
```

# Views

``` dataview
table status, links, tags
from #index 
sort created desc
```
