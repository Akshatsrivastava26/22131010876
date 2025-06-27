import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper
} from "@mui/material";
import { Log } from "./log";


const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";


const defaultFields = () => ({
  longUrl: "",
  validity: "",
  customCode: "",
});

function App() {
  const [urls, setUrls] = useState([defaultFields()]);
  const [results, setResults] = useState([]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...urls];
    updated[index][name] = value;
    setUrls(updated);
  };

  const handleAddField = () => {
    if (urls.length < 5) {
      setUrls([...urls, defaultFields()]);
    }
  };

  const handleShorten = async () => {
    const urlPattern = /^(https?:\/\/)[^\s]+$/;

    const validated = urls.map((entry) => {
      if (!urlPattern.test(entry.longUrl)) {
        return { ...entry, error: "Invalid URL" };
      }
      return { ...entry, error: "" };
    });

    setUrls(validated);

    const hasError = validated.some((u) => u.error);
    if (hasError) {
      await Log("frontend", "error", "component", "Invalid input in one or more fields", accessToken);
      return;
    }

    await Log("frontend", "info", "component", "URL shortening started", accessToken);

    // Simulate shortened URLs
    const dummyResults = validated.map((u, i) => ({
      original: u.longUrl,
      short: `http://localhost:3000/demo${i + 1}`,
      expiresIn: u.validity || "30 (default)",
    }));
    setResults(dummyResults);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        🔗 URL Shortener
      </Typography>

      {urls.map((u, i) => (
        <Paper key={i} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">URL #{i + 1}</Typography>
          <TextField
            label="Long URL"
            name="longUrl"
            value={u.longUrl}
            onChange={(e) => handleChange(i, e)}
            fullWidth
            margin="normal"
            error={!!u.error}
            helperText={u.error}
          />
          <TextField
            label="Validity (minutes)"
            name="validity"
            value={u.validity}
            onChange={(e) => handleChange(i, e)}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Custom Shortcode"
            name="customCode"
            value={u.customCode}
            onChange={(e) => handleChange(i, e)}
            fullWidth
            margin="normal"
          />
        </Paper>
      ))}

      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleAddField}
            disabled={urls.length >= 5}
          >
            ➕ Add URL Field
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleShorten}>
            🚀 Shorten URLs
          </Button>
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Results
        </Typography>
        {results.map((r, idx) => (
          <Paper key={idx} sx={{ p: 2, mt: 1 }}>
            <Typography>
              <strong>Original:</strong> {r.original}
            </Typography>
            <Typography>
              <strong>Short:</strong>{" "}
              <a href={r.short} target="_blank" rel="noopener noreferrer">
                {r.short}
              </a>
            </Typography>
            <Typography>
              <strong>Expires In:</strong> {r.expiresIn} mins
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}

export default App;
