# Get Articles

Find news articles that match one or more search conditions.

You can specify search parameters such as `keyword`, `conceptUri`, `sourceUri`, `categoryUri`, `dateStart`, and more. For complex queries with nested Boolean logic (AND, OR, NOT), use the `query` parameter.

To exclude certain results, use negative conditions like `ignoreKeyword`, `ignoreSourceUri`, and other `ignore*` parameters.

The search can return a list of matching articles (default) or various aggregates (summaries), such as publication times, top sources, sentiment distribution, category distribution, etc.

Each search returns up to 100 articles per call. To retrieve more, use the `articlesPage` parameter (set to 2, 3, 4, etc.). Each call counts as one search action.

---

## Endpoint

```
GET | POST https://eventregistry.org/api/v1/article/getArticles
```

**Headers:**  
`Content-Type: application/json`

---

## Example: Find Latest 'Tesla Inc' Articles

Find news and PR articles mentioning 'Tesla Inc', returning the 100 latest articles with full body, only from sources in the USA, Canada, and UK, excluding paywalled sources, limited to the last month.

Repeat the query with increasing `articlesPage` to get more results.

**Request body:**

```json
{
    "action": "getArticles",
    "keyword": "Tesla Inc",
    "sourceLocationUri": [
        "http://en.wikipedia.org/wiki/United_States",
        "http://en.wikipedia.org/wiki/Canada",
        "http://en.wikipedia.org/wiki/United_Kingdom"
    ],
    "ignoreSourceGroupUri": "paywall/paywalled_sources",
    "articlesPage": 1,
    "articlesCount": 100,
    "articlesSortBy": "date",
    "articlesSortByAsc": false,
    "dataType": [
        "news",
        "pr"
    ],
    "forceMaxDataTimeWindow": 31,
    "resultType": "articles",
    "apiKey": "YOUR_API_KEY"
}
```

---

## Parameters

| Name                         | Type                | Description                                                                                                         | Example / Values                                                                                   | Default      |
|------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|--------------|
| `apiKey`                     | string (required)   | Your API key.                                                                                                       | -                                                                                                  | -            |
| `resultType`                 | string              | Type of results to return.                                                                                          | articles, uriWgtList, langAggr, timeAggr, ...                                                      | articles     |
| `articlesPage`               | integer             | Page of results to return (starting from 1).                                                                        | 1, 2, 3, ...                                                                                       | 1            |
| `articlesCount`              | integer             | Number of articles to return (max 100).                                                                             | 100                                                                                                | 100          |
| `articlesSortBy`             | string              | Sort criteria.                                                                                                      | date, rel, sourceImportance, ...                                                                   | date         |
| `articlesSortByAsc`          | boolean             | Ascending (`true`) or descending (`false`) order.                                                                   | true, false                                                                                        | false        |
| `articleBodyLen`             | integer             | Size of article body in response. Use -1 for full body.                                                             | -1                                                                                                 | -1           |
| `dataType`                   | string/string[]     | Data types to search: news, pr, blog.                                                                               | news, pr, blog                                                                                     | news         |
| `forceMaxDataTimeWindow`     | integer             | Limit results to last 7 or 31 days.                                                                                 | 7, 31                                                                                              | -            |
| `query`                      | object              | Advanced query object (use for complex/nested conditions).                                                          | -                                                                                                  | -            |
| `keyword`                    | string/string[]     | Articles mentioning the keyword(s).                                                                                 | "Barack Obama"                                                                                     | -            |
| `conceptUri`                 | string/string[]     | Articles mentioning the concept(s) (URI).                                                                           | http://en.wikipedia.org/wiki/World_Health_Organization                                             | -            |
| `categoryUri`                | string/string[]     | Articles in specified category(ies).                                                                                | dmoz/Business/Accounting                                                                           | -            |
| `sourceUri`                  | string/string[]     | Articles from specified source(s).                                                                                  | bbc.co.uk                                                                                          | -            |
| `sourceLocationUri`          | string/string[]     | Articles from sources in specified location(s).                                                                     | http://en.wikipedia.org/wiki/Germany                                                               | -            |
| `ignoreKeyword`, ...         | string/string[]     | Exclude articles mentioning specified keyword(s), concept(s), category(ies), source(s), etc.                        | "Donald Trump", http://en.wikipedia.org/wiki/World_Health_Organization, ...                        | -            |
| `lang`                       | string/string[]     | Restrict to articles in specified language(s) (ISO3 codes).                                                         | eng                                                                                                | all          |
| `dateStart`, `dateEnd`       | string              | Restrict to articles published between these dates (YYYY-MM-DD).                                                    | 2018-01-03, 2018-01-10                                                                             | -            |
| `minSentiment`, `maxSentiment` | float             | Filter by sentiment score (-1 to 1, English only).                                                                  | -0.5, 0.5                                                                                          | -            |
| `isDuplicateFilter`          | string              | How to handle duplicate articles.                                                                                   | skipDuplicates, keepOnlyDuplicates, keepAll                                                         | keepAll      |
| `eventFilter`                | string              | Filter articles by event association.                                                                               | skipArticlesWithoutEvent, keepOnlyArticlesWithoutEvent, keepAll                                     | keepAll      |
| ...                          |                     | Many more parameters available for fine-tuning results and included fields.                                         | See API docs                                                                                       |              |

---

## Include/Exclude Fields

You can control which fields are included in the response using boolean flags, such as:

- `includeArticleTitle`
- `includeArticleBody`
- `includeArticleAuthors`
- `includeArticleImage`
- `includeArticleSentiment`
- `includeSourceTitle`
- ...and many more.

See the API documentation for the full list and defaults.

---

For more details, refer to the [Event Registry API documentation](https://eventregistry.org/documentation).
