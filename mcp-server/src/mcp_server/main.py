from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
import chromadb
from chromadb.config import Settings
from typing import List, Optional
from collections import defaultdict
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize ChromaDB client
# In-memory client for simplicity, can be configured for persistence
# client = chromadb.Client()

# Persistent client
# client = chromadb.PersistentClient(path="/app/chroma_data") # For Docker
client = chromadb.PersistentClient(path="../chroma_data") # For local dev

# Create or get a collection
collection_name = "mcp_collection"
collection = client.get_or_create_collection(name=collection_name)

class DocumentIn(BaseModel):
    doc_id: str
    text: str
    metadata: dict = None


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/add_document/")
async def add_document(doc: DocumentIn):
    collection.add(
        documents=[doc.text],
        metadatas=[doc.metadata] if doc.metadata else None,
        ids=[doc.doc_id]
    )
    return {"message": f"Document {doc.doc_id} added."}

@app.get("/query/")
async def query_documents(query_text: str, n_results: int = 5):
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    return results

# Example agent registration endpoint
@app.post("/register_agent/")
async def register_agent(agent_id: str, description: str):
    # In a real application, you'd store this information
    print(f"Agent {agent_id} registered: {description}")
    return {"message": f"Agent {agent_id} registered"}

# Example task assignment endpoint
@app.post("/assign_task/")
async def assign_task(agent_id: str, task_details: dict):
    # In a real application, you'd manage task queues and status
    print(f"Task assigned to agent {agent_id}: {task_details}")
    return {"message": f"Task assigned to {agent_id}", "task": task_details}

@app.get("/group_by/")
async def group_by(field: str = Query(..., description="Metadata field to group by")):
    # Get all documents in the collection
    all_docs = collection.get()["metadatas"]
    groups = defaultdict(list)
    for i, meta in enumerate(all_docs):
        if meta and field in meta:
            groups[meta[field]].append(i)
        else:
            groups["unknown"].append(i)
    return {k: v for k, v in groups.items()}

@app.get("/summarize/")
async def summarize(
    field: Optional[str] = Query(None, description="Metadata field to filter by"),
    value: Optional[str] = Query(None, description="Value of the metadata field to filter by")
):
    # Get all documents and metadatas
    docs = collection.get()
    texts = docs["documents"]
    metadatas = docs["metadatas"]
    # Filter if needed
    if field and value:
        filtered = [t for t, m in zip(texts, metadatas) if m and m.get(field) == value]
    else:
        filtered = texts
    # Simple extractive summary: return first 3 docs
    summary = filtered[:3]
    return {"summary": summary, "count": len(filtered)}

# Placeholder for other agent interaction endpoints
# /submit_result, /get_status, etc.
