// server.js

// webframework for Node.js: simplifies creating HTTP servers and handling routes
import express from 'express';
// cross origin resource sharing, security feature for browsers, prevent website from making request to different domains
// CORS Middleware: Add headers, Allow cross origin
import cors from 'cors';
// fetch is a function to make HTTP requests
import fetch from 'node-fetch';

//create an express application instance, attach routes, middleware, and settings to it
const app = express();
// cors() add CORS headers to all response
app.use(cors());

const API_BASE_URL = 'https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode';

//handle HTTP GET requests
// req request object (incoming data from frontend)
// res response object (send data back to frontend)
app.get('/api/restaurants/:postcode', async (req, res) => {
  try {
    // object destructing: extract postcode
    const { postcode } = req.params;
    console.log(`Proxying request for postcode: ${postcode}`);
    
    // make HHTP request to Just Eat API
    // await = wait for response before continuing
    // returns a response object
    const response = await fetch(`${API_BASE_URL}/${postcode}`);
    
    // if status code 404 (not found), 500 (sever error), 403 (forbidden)
    if (!response.ok) {
      console.error(`API returned ${response.status}`);
      // set Status code (e.g. 404)
      return res.status(response.status).json({ 
        error: `API Error: ${response.status}` 
      });
    }
    
    // success path status (200-299)
    // Parse response body as JSON
    // await = Wait for parsing to complete
    // converts text response to javascript object
    const data = await response.json();
    // print how many restaurant are fetched successfully
    console.log(`Successfully fetched ${data.restaurants?.length || 0} restaurants`);
    // sends JSON response back to frontend
    // Sets Content-Type: application/json header
    res.json(data);
  } catch (error) { // Network failures, JSON parsing errors, Unexpected errors
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n Backend proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to Just Eat API\n`);
});