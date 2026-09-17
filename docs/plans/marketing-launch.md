# Sending Emails via Cloudflare Email MCP API

This guide explains how to use the Cloudflare Email MCP API to send emails with all features.

## 🔑 Original Credentials & Configuration (OG Tokens)

Use the following configuration details to connect to the email sending worker:

*   **Worker API URL**: `https://cf-email-mcp-api.shraj.workers.dev/mcp`
*   **API Token**: `cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE`
*   **Authorized Sender Emails (`from`)**:
    *   `outreach@mail.linespedia.com` (Linespedia)
    *   `mail@out.unstory.app` (Unstory)
    *   `mail@mail.sketchflow.space` (Sketchflow / SopKit)
    *   `outreach@mail.indexfast.co` (IndexFast)
    *   `test@mail.wify.my` (Sandbox/Test Sender)

---

## 🛠️ API Interface Schema

The worker implements the Model Context Protocol (MCP) JSON-RPC 2.0 interface. To call the `send_email` tool, send a `POST` request to `https://cf-email-mcp-api.shraj.workers.dev/mcp` with the following headers and body structure:

### Headers
```http
Content-Type: application/json
Authorization: Bearer cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE
X-API-Key: cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE
```

### JSON-RPC Body Structure
```json
{
  "jsonrpc": "2.0",
  "id": "send-email-unique-id",
  "method": "tools/call",
  "params": {
    "name": "send_email",
    "arguments": {
      "to": "recipient@example.com",
      "from": "outreach@mail.linespedia.com",
      "subject": "Your Email Subject Here",
      "text": "Plain text fallback version of the email.",
      "html": "<p>HTML styled version of the email (optional).</p>",
      "reply_to": "reply-here@example.com"
    }
  }
}
```

### Argument Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `to` | `string` | **Yes** | Recipient email address. |
| `from` | `string` | No | Sender email address (must belong to one of the authorized domains above). |
| `subject` | `string` | **Yes** | Subject line of the email. |
| `text` | `string` | **Yes** | Plain text email content. |
| `html` | `string` | No | Rich HTML email content. |
| `reply_to` | `string` | No | Reply-to email address. |

---

## 💻 Code Examples

### 1. Bash / cURL
Here is how to send an email using cURL from your terminal:

```bash
curl -X POST https://cf-email-mcp-api.shraj.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE" \
  -H "X-API-Key: cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE" \
  -d '{
    "jsonrpc": "2.0",
    "id": "curl-test-1",
    "method": "tools/call",
    "params": {
      "name": "send_email",
      "arguments": {
        "to": "sh20raj@gmail.com",
        "from": "outreach@mail.linespedia.com",
        "subject": "Testing Email Service",
        "text": "Hello! This is a plain text test email.",
        "html": "<h3>Hello!</h3><p>This is a <strong>rich HTML</strong> test email.</p>",
        "reply_to": "shaswatraj3@gmail.com"
      }
    }
  }'
```

### 2. Node.js (fetch)
This example uses the native `fetch` API in Node.js 18+:

```javascript
const url = "https://cf-email-mcp-api.shraj.workers.dev/mcp";
const apiToken = "cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE";

async function sendEmail() {
  const payload = {
    jsonrpc: "2.0",
    id: `send-${Date.now()}`,
    method: "tools/call",
    params: {
      name: "send_email",
      arguments: {
        to: "shaswatraj3@gmail.com",
        from: "mail@out.unstory.app",
        subject: "Dynamic Weekly Dispatch",
        text: "Weekly intelligence brief from Unstory.",
        html: "<h1>Unstory Dispatch</h1><p>Here is your weekly intelligence update...</p>",
        reply_to: "sh20raj@gmail.com"
      }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiToken}`,
      "X-API-Key": apiToken
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(`MCP Error: ${result.error.message || JSON.stringify(result.error)}`);
  }

  console.log("Email sent successfully!", result);
}

sendEmail().catch(console.error);
```

### 3. Python (requests)
```python
import requests
import json
import time

url = "https://cf-email-mcp-api.shraj.workers.dev/mcp"
api_token = "cfut_YOUR_CLOUDFLARE_API_TOKEN_HERE"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_token}",
    "X-API-Key": api_token
}

payload = {
    "jsonrpc": "2.0",
    "id": f"send-py-{int(time.time())}",
    "method": "tools/call",
    "params": {
        "name": "send_email",
        "arguments": {
            "to": "sh20raj@gmail.com",
            "from": "outreach@mail.indexfast.co",
            "subject": "Fast Indexing Alert",
            "text": "Your indexing status report is ready.",
            "html": "<p>Your <strong>indexing status report</strong> is ready.</p>"
        }
    }
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print("Status Code:", response.status_code)
print("Response:", response.json())
```

---

## 🔍 Discovery & Handshake APIs (Optional)

If you are writing custom MCP clients or integrating with specialized tooling, you can perform handshakes with the API:

### 1. MCP Server Discovery (GET /mcp)
Allows clients to verify that the server supports MCP protocols.
```bash
curl https://cf-email-mcp-api.shraj.workers.dev/mcp
```
*Expected Response:*
```json
{
  "mcp": true,
  "name": "Cloudflare Email MCP",
  "endpoints": {
    "rpc": "/mcp"
  }
}
```

### 2. MCP Handshake Initialization (POST /mcp: initialize)
```bash
curl -X POST https://cf-email-mcp-api.shraj.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"init-1","method":"initialize","params":{}}'
```

### 3. Fetching Tool Schemas (POST /mcp: tools/list)
```bash
curl -X POST https://cf-email-mcp-api.shraj.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"tools-1","method":"tools/list"}'
```
