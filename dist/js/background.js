var TOKEN = null;
var MESSAGE_HISTORY_KEY = "message_history";
var AI_KEY = 'AIzaSyAsHc-wvYSKoZrQr-LRqWtgow32cer7NhU';
const BASIC_PROMPT = `
    You are salesperson. 
    CONTEXT: "{{CONTEXT}}"
    DATETIME: "{{DATETIME}} "
    Read numbers, dates, days of the week, and time in the context. For instance, if someone says, “can you follow up with me next Monday?” It sets a reminder for 8 am (in whatever time zone the user is in) for the following Monday. If someone says, “Yea, we can catch up tomorrow. How about 2 pm?” It then respnse a task/reminder for 2 pm ET for tomorrow.
    Below are some examples.
    1. We should be able to start to make the system understand that when DATETIME is Monday, December 23, 2024 and it says “We don’t plan to launch till the renovation is complete in Q1.” That the system can decipher that Q1 is the upcoming Q1 in 2025 and then sets  the date for the earliest time to follow up in that time frame which is January 1, 2025.
    2. b.Another example: “We’ll circle back with you on this during reforecast season.” The system should know the time this email was sent which was on Tuesday, January 7th and should then set a forward task/reminder for June 1, 2025. This is because people reforecast usually twice a year/halfway through the year.
    3. This example: “I am traveling for work and will not be able to connect for a few weeks” Since “a few” usually means two. I’d set this type of task for 2 weeks from this date, so if it was sent Tuesday, September 10th 2024. I’d set if for two Tuesdays in the future.
    4. Here is an easy example. The email was sent on Thursday, Dec 19, 2024. We will set this one for 2 pm on Friday, December 20, 2024.
    5. This one is very vague. It was received Thursday, December 19th 2024. It essentially is saying they will let us know. However, in sales you have to be proactive so I’d set a task/reminder like this for exactly a month from now. For emails like the below. Let’s set the reminders for 30-days out. 
    6. f.Another vague example: I’d set this one for two weeks because the response was more that “his partner has been out of town” with “out of town” being the keyword. Since this is just a traveling delay. I’d set this task for 2 weeks from the date of Wednesday, December 18, 2024.
    Please response the only datetime. If you are not sure about date in context, please answer only "no_schedule"
`;

function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

async function getAuthTokenSilent() {

    // clearStorage();
    getAuthToken({
        'interactive': false,
        'callback': getAuthTokenSilentCallback,
    });
}

function clearStorage() {
    chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
            console.error("Error clearing local storage:", chrome.runtime.lastError);
        } else {
            console.log("Local storage cleared.");
        }
    });
}
function getAuthTokenSilentCallback(token) {
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        TOKEN = token;
        if (TOKEN) {
            getUnreadMessages();
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

            for(let k = 0; k < result.length; k++) {
                const item = result[k];
                if (!Object.keys(message_history).includes(item.message_id)) {
                    // const schedule_date = await getResponseFromAI(
                    //     BASIC_PROMPT.replace("{{CONTEXT}}", item.content).replace("{{DATETIME}}", item.date)
                    // )
                    // item["schedule_date"] = schedule_date;
                    console.log(item);
                    message_history[item['message_id']] = item;
                    is_updated = true;
                }
            }
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
        message_id: id
    }
}

async function getResponseFromAI(message) {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + AI_KEY;

    const payload = [{
        "parts": [{ "text": message }]
    }]

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ contents: payload }),
    });
    if (!response.ok) {
        throw new Error(`${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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

async function analyseMessage() {
    
}

getAuthTokenSilent();
analyseMessage();
chrome.alarms.create('update-count', { 'delayInMinutes': 15, 'periodInMinutes': 15 });
