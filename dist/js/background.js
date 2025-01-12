var TOKEN = null;
var MESSAGE_HISTORY_KEY = "message_history";
var AI_KEY = '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';

function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

async function getAuthTokenSilent() {
    // const response = await getResponseFromAI("Tomorrow is good for meeting I think.");
    // console.log(response);
    // return;
    getAuthToken({
        'interactive': false,
        'callback': getAuthTokenSilentCallback,
    });
}

function getAuthTokenSilentCallback(token) {
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        TOKEN = token;
        if (TOKEN) {
            setInterval(function () { getUnreadMessages() }, 5000);
        }
    }
}

function showAuthNotification() {
    var options = {
        'id': 'start-auth',
        'iconUrl': 'img/developers-logo.png',
        'title': 'GDE Sample: Chrome extension Google APIs',
        'message': 'Click here to authorize access to Gmail',
    };
    createBasicNotification(options);
}

function createBasicNotification(options) {
    var notificationOptions = {
        'type': 'basic',
        'iconUrl': options.iconUrl, // Relative to Chrome dir or remote URL must be whitelisted in manifest.
        'title': options.title,
        'message': options.message,
        'isClickable': true,
    };
    chrome.notifications.create(options.id, notificationOptions, function (notificationId) { });
}

async function getUnreadMessages() {
    const promises = [];
    fetch("https://www.googleapis.com/gmail/v1/users/me/messages?q=label:unread+category:primary", {
        headers: { 'Authorization': "Bearer " + TOKEN },
    }).then((json) => json.json())
        .then(async (data) => {
            data.messages.map((item) => {
                promises.push(getMessages(item.id))
            })
            const result = await Promise.all(promises);
            let message_history = await getStorageData(MESSAGE_HISTORY_KEY);

            let is_updated = false;
            result.map((item) => {
                if (!Object.keys(message_history).includes(item.id)) {
                    message_history = { ...message_history, [item.message_id]: item };
                    is_updated = true;
                }
            })
            if (is_updated) {
                const saved_status = await saveMessageHistoryToStorage(message_history);
            }
        })
}

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}

const convertDateToIso = (internal_date) => {
    const date = new Date(internal_date);
    const formattedDate = date.toLocaleString("en-US", {
        weekday: "short",  // Mon, Tue, etc.
        month: "short",    // Jan, Feb, etc.
        day: "numeric",    // 1, 2, ..., 31
        year: "numeric",   // Full year (e.g., 2024)
        hour: "numeric",   // Hour in 12-hour format
        minute: "2-digit", // Two-digit minute
        hour12: true       // 12-hour clock (AM/PM)
    });

    return formattedDate;
}
const getStorageData = async (key) => {
    return toPromise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
            const researches = result[key] ?? {};
            resolve(researches);
        });
    });
}

const saveMessageHistoryToStorage = (messages) => {
    return toPromise((resolve, reject) => {
        chrome.storage.local.set({ [MESSAGE_HISTORY_KEY]: messages }, () => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
            resolve(messages);
        });
    });
}

async function getMessages(id) {
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/" + id, {
        headers: { 'Authorization': "Bearer " + TOKEN },
    });
    const data = await res.json();
    const converted_headers = data.payload.headers.reduce((acc, item) => {
        acc[item.name] = item.value;
        return acc;
    }, {});

    return {
        internal_date: data.internalDate,
        iso_date: convertDateToIso(Number(data.internalDate)),
        content: data.snippet,
        subject: converted_headers.Subject,
        from: converted_headers.From,
        date: converted_headers.Date,
        message_id: id,
    }
}

async function getResponseFromAI(message) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are an assistant that extracts actionable tasks and reminders from emails. Return the results in JSON format.",
            },
            {
                role: "user",
                content: `Here is the email content: "${message}"`,
            },
        ],
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_KEY}`,
        },
        body: JSON.stringify(payload),
    });
    console.log(response);
    if (!response.ok) {
        throw new Error(`${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

function updateLabelCountCallback(label) {
    setBadgeCount(label.threadsUnread);
}

function setBadgeCount(count) {
    var color = '#9E9E9E';
    var title = 'No unread mail';
    if (count > 0) {
        color = '#F44336';
        title = count + ' unread mail';
    }
    setBadge({
        'text': count + '', // Cast count int to string.
        'color': color,
        'title': title,
    });
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action == "get_messages") {
        // const data = await getStorageData(MESSAGE_HISTORY_KEY);
        // console.log(data);
        // sendResponse({data});
    }
});

function setBadge(options) {
    chrome.browserAction.setBadgeText({ 'text': options.text });
    chrome.browserAction.setBadgeBackgroundColor({ 'color': options.color });
    chrome.browserAction.setTitle({ 'title': options.title });
}

getAuthTokenSilent();
chrome.alarms.create('update-count', { 'delayInMinutes': 15, 'periodInMinutes': 15 });
