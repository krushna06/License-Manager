# Discord License Manager

This is a Discord bot built with `discord.js` that manages licenses for products using SQLite for data storage. It includes commands for creating, listing, and suspending licenses.

## Features
✅ Create new licenses with start and expiry timestamps.  
✅ Display license details in a clean Discord embed.  
✅ API support for product license verification.  
✅ SQLite database integration for easy management.  

## Setup Instructions
1. Clone the repository:
```bash
git clone https://github.com/krushna06/License-Manager
cd License-Manager
```

2. Install dependencies:
```bash
npm install discord.js sqlite3 express dotenv
```

3. Create a `.env` file with the following content:
```
TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_DISCORD_CLIENT_ID
```

4. Run the bot:
```bash
node .
```

## Commands
- `/createlicense product_name: <name> username: <username> start: <current_time/settime> expiry: <settime/NA>`  
- `/listlicenses type: <all/active/inactive/suspended> username: <username>`  
- `/suspendlicense license_id: <license_id>`

## API Endpoints
**Base URL:** `http://localhost:3000`

### `/api/license/:licenseId`
**Method:** GET  
**Response Example:**
```json
{
  "success": true,
  "license": {
    "id": "crypto-id",
    "product_name": "valorant",
    "username": "nostep",
    "start_time": "1710027622",
    "expiry_time": "NA",
    "status": "active"
  }
}
```

### Error Response Example:
```json
{
  "success": false,
  "error": "License not found"
}
```