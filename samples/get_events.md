# Get Events

Find events that match one or more search conditions.

You can specify search parameters such as `keyword`, `conceptUri`, `sourceUri`, `categoryUri`, `dateStart`, and more. For complex queries with nested Boolean logic (AND, OR, NOT), use the `query` parameter.

To exclude certain results, use negative conditions like `ignoreKeyword`, `ignoreSourceUri`, and other `ignore*` parameters.

Results can be a list of matching events (default) or various aggregates (summaries), such as geographic locations, event dates, etc.

Each search returns up to **50 events per call**. To retrieve more, use the `eventsPage` parameter (set to 2, 3, 4, etc.). Each call counts as one event action.

---

## Endpoint

```
GET | POST https://eventregistry.org/api/v1/event/getEvents
```

**Headers**

```
Content-Type: application/json
```

---

## Example: Search for Events Related to Barack Obama

Sort results by relevance (most to least relevant):

```json
{
    "resultType": "events",
    "conceptUri": "http://en.wikipedia.org/wiki/Barack_Obama",
    "eventsPage": 1,
    "eventsCount": 50,
    "eventsSortBy": "rel",
    "eventsSortByAsc": false,
    "eventsArticleBodyLen": -1,
    "apiKey": "YOUR_API_KEY",
    "forceMaxDataTimeWindow": 31
}
```

---

## Parameters

| Name                        | Type                | Description                                                                                                   | Default / Example                  |
|-----------------------------|---------------------|---------------------------------------------------------------------------------------------------------------|------------------------------------|
| `apiKey`                    | string (required)   | Your API key                                                                                                  |                                    |
| `resultType`                | string / string[]   | Type of results: `events`, `uriWgtList`, `timeAggr`, `locAggr`, etc.                                          | `events`                           |
| `eventsPage`                | integer             | Page of results (starting from 1)                                                                             | `1`                                |
| `eventsCount`               | integer             | Number of events to return (max 50)                                                                           | `50`                               |
| `eventsSortBy`              | string              | Sort by: `date`, `rel`, `size`, `socialScore`                                                                 | `date`                             |
| `eventsSortByAsc`           | boolean             | Ascending order (`true`) or descending (`false`)                                                               | `false`                            |
| `forceMaxDataTimeWindow`    | integer             | Limit to last 7 or 31 days                                                                                    |                                    |
| `query`                     | object              | Advanced query object (overrides other search params)                                                          |                                    |
| `keyword`                   | string / string[]   | Events mentioning keyword(s)                                                                                   | `Barack Obama`                     |
| `conceptUri`                | string / string[]   | Events about concept(s)                                                                                        | `http://en.wikipedia.org/wiki/World_Health_Organization` |
| `categoryUri`               | string / string[]   | Events about category(ies)                                                                                     | `dmoz/Business/Accounting`         |
| `sourceUri`                 | string / string[]   | Events from specific news source(s)                                                                            | `bbc.co.uk`                        |
| `sourceLocationUri`         | string / string[]   | News sources by location                                                                                       | `http://en.wikipedia.org/wiki/Germany` |
| `authorUri`                 | string / string[]   | Events by author(s)                                                                                            | `mark_mazzetti@nytimes.com`        |
| `locationUri`               | string / string[]   | Events at location(s)                                                                                          | `http://en.wikipedia.org/wiki/United_States` |
| `lang`                      | string / string[]   | Article language(s) (ISO3 codes)                                                                              | `eng`                              |
| `dateStart` / `dateEnd`     | string              | Event date range (`YYYY-MM-DD`)                                                                                | `2018-01-03` / `2018-01-10`        |
| `minSentimentEvent`         | float               | Minimum sentiment (-1 to 1)                                                                                    |                                    |
| `maxSentimentEvent`         | float               | Maximum sentiment (-1 to 1)                                                                                    |                                    |
| `minArticlesInEvent`        | integer             | Minimum number of articles in event                                                                            |                                    |
| `maxArticlesInEvent`        | integer             | Maximum number of articles in event                                                                            |                                    |
| `reportingDateStart/End`    | string              | Reporting date range (`YYYY-MM-DD`)                                                                            |                                    |
| `dateMentionStart/End`      | string              | Mentioned date range (`YYYY-MM-DD`)                                                                            |                                    |
| `keywordLoc`                | string              | Where to search for keywords: `body`, `title`, `body,title`                                                    | `body`                             |
| `keywordOper`               | string              | Boolean operator for keywords: `and`, `or`                                                                     | `and`                              |
| `conceptOper`               | string              | Boolean operator for concepts: `and`, `or`                                                                     | `and`                              |
| `categoryOper`              | string              | Boolean operator for categories: `and`, `or`                                                                   | `or`                               |

### Negative Filters

| Name                        | Type                | Description                                                                                                   | Example                            |
|-----------------------------|---------------------|---------------------------------------------------------------------------------------------------------------|------------------------------------|
| `ignoreKeyword`             | string / string[]   | Exclude events mentioning keyword(s)                                                                          | `Donald Trump`                     |
| `ignoreConceptUri`          | string / string[]   | Exclude events about concept(s)                                                                               | `http://en.wikipedia.org/wiki/World_Health_Organization` |
| `ignoreCategoryUri`         | string / string[]   | Exclude events about category(ies)                                                                            | `dmoz/Business/Accounting`         |
| `ignoreSourceUri`           | string / string[]   | Exclude events from source(s)                                                                                  | `bbc.co.uk`                        |
| `ignoreSourceLocationUri`   | string / string[]   | Exclude events from sources at location(s)                                                                    | `bbc.co.uk`                        |
| `ignoreSourceGroupUri`      | string / string[]   | Exclude events from source group(s)                                                                           | `general/ERtop10`                  |
| `ignoreAuthorUri`           | string / string[]   | Exclude events by author(s)                                                                                   | `mark_mazzetti@nytimes.com`        |
| `ignoreLocationUri`         | string / string[]   | Exclude events at location(s)                                                                                 | `http://en.wikipedia.org/wiki/United_States` |
| `ignoreLang`                | string / string[]   | Exclude events in language(s) (ISO3 codes)                                                                    | `deu`                              |
| `ignoreKeywordLoc`          | string              | Where to search for ignore keywords: `body`, `title`, `body,title`                                            |                                    |

---

## Response Options

Set these booleans to include extra data in the response:

- `includeEventTitle` (default: true)
- `includeEventSummary` (default: false)
- `includeEventSocialScore` (default: false)
- `includeEventSentiment` (default: true)
- `includeEventLocation` (default: true)
- `includeEventDate` (default: true)
- `includeEventArticleCounts` (default: true)
- `includeEventConcepts` (default: true)
- `includeEventCategories` (default: true)
- `includeEventCommonDates` (default: false)
- `includeEventStories` (default: false)
- `eventImageCount` (default: 0)
- `includeConceptLabel` (default: true)
- `includeConceptImage` (default: false)
- `includeConceptSynonyms` (default: false)
- `conceptLang` (default: eng)
- `includeStoryBasicStats` (default: false)
- `includeStoryTitle` (default: false)
- `includeStoryLocation` (default: false)
- `includeStoryDate` (default: false)
- `includeStoryConcepts` (default: false)
- `includeStoryCategories` (default: false)
- `includeStoryMedoidArticle` (default: false)
- `includeStoryCommonDates` (default: false)
- `storyImageCount` (default: 0)
- `includeCategoryParentUri` (default: false)
- `includeLocationPopulation` (default: false)
- `includeLocationGeoNamesId` (default: false)
- `includeLocationCountryArea` (default: false)
- `includeLocationCountryContinent` (default: false)

---

For more details, see the [Event Registry API documentation](https://eventregistry.org/documentation).
