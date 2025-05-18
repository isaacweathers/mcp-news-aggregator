import React, { useState } from "react";
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
  Divider,
  TextField,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_BASE = "http://localhost:8000";

function getExecutiveSummary(text) {
  // Return the first sentence or first 25 words as a summary
  if (!text) return '';
  const firstSentence = text.split(/[.!?]/)[0];
  if (firstSentence.split(' ').length < 25) return firstSentence + '...';
  return text.split(' ').slice(0, 25).join(' ') + '...';
}

function App() {
  const [groupField, setGroupField] = useState("source");
  const [groups, setGroups] = useState({});
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [expanded, setExpanded] = useState({});

  // Fetch groups only after search is submitted
  const fetchGroups = () => {
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
  };

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

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
    fetchGroups();
  };

  const handleExpandClick = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
      <Container maxWidth="lg" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        py: { xs: 4, md: 8 },
      }}>
        <Box sx={{ width: { xs: '100%', sm: 500, md: 700 }, mb: 4 }}>
          <form onSubmit={handleSearch}>
            <TextField
              label="Describe the type of stories you want"
              variant="outlined"
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              fullWidth
            >
              Search
            </Button>
          </form>
        </Box>
        {searchSubmitted && (
          <>
            <Box sx={{ width: { xs: '100%', sm: 500, md: 700 }, mb: 4 }}>
              <FormControl fullWidth>
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
              {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={28} /></Box>}
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 500, md: 700 }, mb: 4 }}>
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
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 500, md: 700 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <SummarizeIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {summary.length === 0 && !loading && (
                <Typography color="text.secondary">No summary to display.</Typography>
              )}
              {summary.map((text, i) => (
                <Card key={i} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Executive Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getExecutiveSummary(text)}
                    </Typography>
                    <IconButton
                      onClick={() => handleExpandClick(i)}
                      aria-expanded={!!expanded[i]}
                      aria-label="show more"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      <ExpandMoreIcon sx={{ transform: expanded[i] ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                    </IconButton>
                    <Collapse in={!!expanded[i]} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          {text}
                        </Typography>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;
