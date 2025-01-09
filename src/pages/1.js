// OAuth2 credentials
const CLIENT_ID = '685765035628-eo59gjt13kq27mqg4ggj8ic34tpfeddq.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
const BATCH_LIMIT = 2;
const GMAIL_BATCH_URL = 'https://www.googleapis.com/batch/gmail/v1';

// Helper to fetch access token using chrome.identity API
function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

// Fetch inbox message IDs
function fetchInboxMessageIds(authToken, messageIds = [], pageToken = '') {
  return new Promise((resolve, reject) => {
    const url = new URL('https://www.googleapis.com/gmail/v1/users/me/messages');
    url.searchParams.set('labelIds', 'INBOX');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        messageIds = [...messageIds, ...(data.messages || []).map(m => m.id)];
        if (data.nextPageToken) {
          resolve(fetchInboxMessageIds(authToken, messageIds, data.nextPageToken));
        } else {
          resolve(messageIds);
        }
      })
      .catch(reject);
  });
}

// Fetch full messages in batches
async function fetchFullMessages(authToken, messageIds) {
  const messageQueries = messageIds.map(id => ({ uri: `/gmail/v1/users/me/messages/${id}` }));
  const limitedMessageQueries = messageQueries.slice(0, BATCH_LIMIT);

  return await fetchBatch(authToken, limitedMessageQueries);
}

// Create batch request body
function createBatchBody(apiCalls, boundary) {
  let batchBody = [];

  apiCalls.forEach(call => {
    const method = call.method || 'GET';
    let uri = call.uri;
    if (call.qs) uri += '?' + new URLSearchParams(call.qs).toString();
    let body = '\r\n';
    if (call.body) {
      body = [
        'Content-Type: application/json',
        '\r\n\r\n',
        JSON.stringify(call.body),
        '\r\n'
      ].join('');
    }

    batchBody = batchBody.concat([
      '--',
      boundary,
      '\r\n',
      'Content-Type: application/http',
      '\r\n\r\n',
      method,
      ' ',
      uri,
      '\r\n',
      body
    ]);
  });

  return batchBody.concat(['--', boundary, '--']).join('');
}

// Fetch batch requests
async function fetchBatch(accessToken, apiCalls, boundary = 'batch_taskjet_google_lib_api', batchUrl = GMAIL_BATCH_URL) {
  const batchBody = createBatchBody(apiCalls, boundary);
  const response = await fetch(batchUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/mixed; boundary="${boundary}"`,
    },
    body: batchBody,
  });

  const text = await response.text();
  return parseBatchResponse(text);
}

// Parse the response from the batch API
function parseBatchResponse(response) {
  const delimiter = response.substring(0, response.indexOf('\r\n'));
  const parts = response.split(delimiter);

  parts.shift(); // Remove first empty part
  parts.pop(); // Remove last "--"

  return parts.map(part => {
    try {
      return JSON.parse(part.substring(part.indexOf('{'), part.lastIndexOf('}') + 1));
    } catch (e) {
      return {
        errors: [{ message: part, error: e }]
      };
    }
  });
}

// Handle incoming message to start the Gmail fetch process
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'fetchInbox') {
    try {
      const authToken = await getAccessToken();
      const messageIds = await fetchInboxMessageIds(authToken);
      const fullMessages = await fetchFullMessages(authToken, messageIds);
      sendResponse({ success: true, fullMessages });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Async response
});
