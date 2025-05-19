# MCP News Aggregator

A multi-agent, multi-modal news and event aggregation system using FastAPI, ChromaDB, and a modern React (Vite + Material UI) frontend.

---

## Project Structure

```
/workspaces/python-7/
├── mcp-server/
│   ├── agents/                # Python agents (news fetchers, etc.)
│   │   └── news_agent.py
│   ├── src/
│   │   └── mcp_server/
│   │       └── main.py        # FastAPI MCP server
│   ├── frontend/              # React + Vite + Material UI frontend
│   │   └── src/App.jsx
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── pyproject.toml         # Poetry config for Python deps
│   ├── poetry.lock
│   ├── .env                   # API keys and config (not checked in)
│   └── README.md              # (this file)
├── samples/                   # Example API docs and sample data
└── README.md                  # Project root readme
```

---

## How It Works

- **Agents** (Python scripts) fetch news/articles/events from external APIs (e.g., Event Registry) and POST them to the MCP server.
- **MCP Server** (FastAPI + ChromaDB) stores, groups, and summarizes documents. It exposes endpoints for agents and the frontend.
- **Frontend** (React + Material UI) lets users search, group, and summarize news interactively.

---

## Quickstart (Local Development)

### 1. Clone the repo and enter the project directory
```bash
cd /workspaces/python-7/mcp-server
```

### 2. Set up your API keys
Create a `.env` file in `mcp-server/` (see `.env.example` if present):
```
NEWS_API_KEY=your_eventregistry_api_key_here
MCP_SERVER_URL=http://localhost:8000
```

### 3. Build and start the MCP server (FastAPI + ChromaDB)
```bash
docker compose up --build -d
```
- The server will be available at [http://localhost:8000](http://localhost:8000)

### 4. Install frontend dependencies and start the React app
```bash
cd frontend
npm install
npm run dev
```
- The frontend will be available at [http://localhost:5173](http://localhost:5173)

### 5. Run the news agent to fetch articles
```bash
cd ../agents
python3 news_agent.py
```
- This will fetch news and POST them to the MCP server.

---

## API Keys
- **Event Registry API Key:** Get one from https://eventregistry.org/
- Place it in `.env` as `NEWS_API_KEY`.
- Never commit your real API keys to version control!

---

## Main Components

### MCP Server (`src/mcp_server/main.py`)
- FastAPI app with endpoints:
  - `/add_document/` (POST): Add a document (used by agents)
  - `/group_by/` (GET): Group docs by metadata (e.g., source)
  - `/summarize/` (GET): Summarize docs by group
  - `/query/` (GET): Vector search (semantic)
- Uses ChromaDB for persistent storage (see Dockerfile for SQLite setup)
- CORS enabled for frontend access

### News Agent (`agents/news_agent.py`)
- Fetches news from Event Registry API
- Posts each article to MCP server with metadata
- Loads API keys from `.env` using `python-dotenv`
- You can change the topic in the script or make it parameterized

### Frontend (`frontend/src/App.jsx`)
- Modern React + Material UI dashboard
- Search for stories by description
- Group and summarize articles
- Responsive, desktop-friendly layout
- Executive summary for each article, expandable for full text

---

## Customization & Extending
- Add more agents for other data sources or tasks
- Add more endpoints to the MCP server for analytics, advanced summarization, etc.
- Tweak the frontend for more features or a custom look

---

## Troubleshooting
- If you see CORS errors, make sure the MCP server is running and CORS is enabled for `http://localhost:5173`.
- If you see `{}` in the UI, make sure you have run the agent and that the server is using a persistent ChromaDB volume.
- For persistent ChromaDB data, uncomment the volume in `docker-compose.yml` and set the path in `main.py` accordingly.

---

## License
MIT (or your preferred license)
