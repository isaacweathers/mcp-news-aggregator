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
    const urlToFetch = `${API_BASE}/group_by/?field=${groupField}`;
    console.log(`Fetching groups from: ${urlToFetch}`);
    fetch(urlToFetch)
      .then((res) => {
        console.log(`Response status from ${urlToFetch}:`, res.status); // Corrected log
        if (!res.ok) {
          res.text().then(text => console.error(`Error response body from ${urlToFetch}:`, text));
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Data received from ${urlToFetch}:`, data); // Corrected log
        setGroups(data);
      })
      .catch(error => {
        console.error(`Error fetching or parsing data from ${urlToFetch}:`, error);
      })
      .finally(() => setLoading(false));
  }, [groupField]);

  // Fetch summary
  const fetchSummary = (field, value) => {
    setLoading(true);
    let urlToFetch = `${API_BASE}/summarize/`; // Renamed for consistency
    if (field && value) {
      urlToFetch += `?field=${field}&value=${encodeURIComponent(value)}`;
    }
    console.log(`Fetching summary from: ${urlToFetch}`);
    fetch(urlToFetch)
      .then((res) => {
        console.log(`Response status from ${urlToFetch}:`, res.status); // Corrected log
        if (!res.ok) {
          res.text().then(text => console.error(`Error response body from ${urlToFetch}:`, text));
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Data received from ${urlToFetch}:`, data.summary); // Corrected log
        setSummary(data.summary || []);
      })
      .catch(error => {
        console.error(`Error fetching or parsing data from ${urlToFetch}:`, error);
      })
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
