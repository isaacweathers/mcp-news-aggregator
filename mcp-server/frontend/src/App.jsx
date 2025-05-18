import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';

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
    fetch(urlToFetch)
      .then((res) => {
        if (!res.ok) {
          res.text().then(text => console.error(`Error response body from ${urlToFetch}:`, text));
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setGroups(data))
      .catch(error => {
        console.error(`Error fetching or parsing data from ${urlToFetch}:`, error);
      })
      .finally(() => setLoading(false));
  }, [groupField]);

  // Fetch summary
  const fetchSummary = (field, value) => {
    setLoading(true);
    let urlToFetch = `${API_BASE}/summarize/`;
    if (field && value) {
      urlToFetch += `?field=${field}&value=${encodeURIComponent(value)}`;
    }
    fetch(urlToFetch)
      .then((res) => {
        if (!res.ok) {
          res.text().then(text => console.error(`Error response body from ${urlToFetch}:`, text));
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setSummary(data.summary || []))
      .catch(error => {
        console.error(`Error fetching or parsing data from ${urlToFetch}:`, error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <GroupIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MCP News Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="group-by-label">Group by</InputLabel>
              <Select
                labelId="group-by-label"
                value={groupField}
                label="Group by"
                onChange={e => setGroupField(e.target.value)}
              >
                <MenuItem value="source">Source</MenuItem>
                <MenuItem value="publishedAt">Published Date</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            {loading && <CircularProgress size={28} />}
          </Stack>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Groups
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {Object.entries(groups).map(([key, ids]) => (
              <ListItem key={key} disablePadding>
                <ListItemButton onClick={() => fetchSummary(groupField, key)}>
                  <ListItemText
                    primary={<b>{key}</b>}
                    secondary={`${ids.length} docs`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {Object.keys(groups).length === 0 && !loading && (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                No groups found.
              </Typography>
            )}
          </List>
        </Paper>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <SummarizeIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {summary.length === 0 && !loading && (
              <Typography color="text.secondary">No summary to display.</Typography>
            )}
            {summary.map((text, i) => (
              <Card key={i} variant="outlined">
                <CardContent>
                  <Typography>{text}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
