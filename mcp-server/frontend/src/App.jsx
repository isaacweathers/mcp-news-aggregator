import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

function App() {
  const [groupField, setGroupField] = useState("source");
  const [groups, setGroups] = useState({});
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch groups
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/group_by/?field=${groupField}`)
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .finally(() => setLoading(false));
  }, [groupField]);

  // Fetch summary
  const fetchSummary = (field, value) => {
    setLoading(true);
    let url = `${API_BASE}/summarize/`;
    if (field && value) {
      url += `?field=${field}&value=${encodeURIComponent(value)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setSummary(data.summary || []))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>MCP News Dashboard</h1>
      <div>
        <label>Group by: </label>
        <select value={groupField} onChange={e => setGroupField(e.target.value)}>
          <option value="source">Source</option>
          <option value="publishedAt">Published Date</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <h2>Groups</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {Object.entries(groups).map(([key, ids]) => (
          <li key={key}>
            <button onClick={() => fetchSummary(groupField, key)}>
              {key} ({ids.length} docs)
            </button>
          </li>
        ))}
      </ul>
      <h2>Summary</h2>
      <ol>
        {summary.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ol>
    </div>
  );
}

export default App;
