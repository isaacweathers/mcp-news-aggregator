import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# CONFIGURATION
MCP_SERVER_URL = os.environ.get("MCP_SERVER_URL", "http://localhost:8000")
NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "YOUR_NEWSAPI_KEY")
EVENTREGISTRY_API_URL = "https://eventregistry.org/api/v1/article/getArticles"

# Fetch news articles about a topic from Event Registry
def fetch_news(topic, page_size=5):
    params = {
        "action": "getArticles",  # Added action parameter
        "keyword": topic,         # Using direct keyword parameter
        "forceMaxDataTimeWindow": 31,  # Integer value
        "resultType": "articles",
        "articlesSortBy": "date",
        "apiKey": NEWS_API_KEY,
        "articlesCount": page_size  # Use page_size to limit results for testing
    }
    print(f"Fetching news with params: {params}") # Log params
    resp = requests.get(EVENTREGISTRY_API_URL, params=params)
    print(f"Event Registry API response status: {resp.status_code}") # Log status code
    try:
        data = resp.json()
        print(f"Event Registry API response data: {data}") # Log full response data
    except requests.exceptions.JSONDecodeError:
        print(f"Failed to decode JSON from response. Response text: {resp.text}")
        data = {}
    resp.raise_for_status()
    # Extract articles from Event Registry response
    articles = data.get("articles", {}).get("results", [])
    print(f"Found {len(articles)} articles.") # Log number of articles found
    return articles

# Post news articles to MCP server
def post_to_mcp(doc_id, text, metadata=None):
    url = f"{MCP_SERVER_URL}/add_document/"
    data = {"doc_id": doc_id, "text": text, "metadata": metadata or {}}
    resp = requests.post(url, json=data)
    resp.raise_for_status()
    return resp.json()

if __name__ == "__main__":
    topic = "AI research"
    articles = fetch_news(topic)
    for article in articles:
        doc_id = article["uri"]
        text = article["title"] + "\n" + (article.get("body") or "")
        metadata = {
            "source": article.get("source", {}).get("title", "unknown"),
            "publishedAt": article.get("date", "unknown"),
            "url": article.get("url", "")
        }
        result = post_to_mcp(doc_id, text, metadata)
        print(f"Posted: {doc_id} -> {result}")
