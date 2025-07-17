const fs = require('fs');
const https = require('https');
const path = require('path');

// Read MCP config from .cursor/mcp.json
const mcpConfigPath = path.join(__dirname, '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));

// Extract Supabase MCP server config
const supabaseMcp = mcpConfig.mcpServers && mcpConfig.mcpServers.supabase;
if (!supabaseMcp) {
  console.error('No supabase MCP server config found in .cursor/mcp.json');
  process.exit(1);
}

// Extract API key
const MCP_API_KEY = supabaseMcp.env && supabaseMcp.env.SUPABASE_ACCESS_TOKEN;
if (!MCP_API_KEY) {
  console.error('No SUPABASE_ACCESS_TOKEN found in .cursor/mcp.json');
  process.exit(1);
}

// You may need to manually set the MCP server URL if not present in the config
const MCP_SERVER_URL = 'YOUR_MCP_SERVER_URL'; // <-- Set this to your MCP server URL
const hostname = MCP_SERVER_URL.replace('https://', '');

const options = {
  hostname: hostname,
  port: 443,
  path: '/api/organizations',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${MCP_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const organizations = JSON.parse(data);
      console.log('Organizations:');
      console.log(JSON.stringify(organizations, null, 2));
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end(); 