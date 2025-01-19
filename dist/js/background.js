var TOKEN = null;
var MESSAGE_HISTORY_KEY = "message_history";
var TOKEN_KEY = "token";
var AI_KEY = 'AIzaSyCQrKcGYyeIlspCT7N5gYriPyev8OIE-GM';
var NOTIFICATION_DEFAULT_PERIOD = 1000 * 60 * 5; // 5 minutes
var SCHEDULE_SET_TIMEOUT = setTimeout(function(){}, NOTIFICATION_DEFAULT_PERIOD);
var SCHEDULE_NOTIFICATION_OPTION = {};

const BASIC_PROMPT = `
You are salesperson in our company. You target  is to get schedule from context. context is the message from users in vague user's message. 
I will provide the user's message and date that we got the user's message.
User's message is "{{CONTEXT}}" 
Date for user's message is "{{DATETIME}}" 
Read numbers, dates, days of the week, and time in the user's message.
There are some examples, but there are many cases as like vague user's message, 
1. if someone says, “can you follow up with me next Monday?” It sets a reminder for 8 am (in whatever time zone the user is in) for the following Monday. If someone says, “Yea, we can catch up tomorrow. How about 2 pm?” It then schedules a task/reminder for 2 pm ET for tomorrow.
2. If user's message is "We don’t plan to launch till the renovation is complete in Q1", If the date of got the  user's email is after 1 quarter, it should be considered as the 1st quarter of the following year and recognized as January 1 of the following year.
3. If the message as like "We’ll circle back with you on this during reforecast season.", becase people reforecast usually twice a year/halfway through the year, you need to calcuate the next time from date got user's message.
4. If the message as like ".“I am traveling for work and will not be able to connect for a few weeks” ",  you need to calcuate the date from date got your user's message.
5. If  message is as like "It essentially is saying they will let us know.", you need to indicate set shedule after 1 month since date got user's message.
6. If  message is as like "lets circle back in 8-9 months.", you can take the earliest time frame he gives us and set a note to follow up 8-months (240 days - which is 30 days x 8) since date got user's message.
7. If you dected shedule is in holiday, you need to set the schedule again the next day.
I don't need your description and please must answer only you detected sheduled with internal date. If you are not sure about date in context, Please must answer only as like "no_schedule" 
`;

function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

async function getAuthTokenSilent() {
    getAuthToken({
        'interactive': true,
        'callback': getAuthTokenSilentCallback,
    });
}

// function getAuthTokenInteractive() {
//     getAuthToken({
//         'interactive': true,
//         'callback': getAuthTokenInteractiveCallback,
//     });
// }

// function getAuthTokenInteractiveCallback(token) {
//     // Catch chrome error if user is not authorized.
//     if (chrome.runtime.lastError) {
//         showAuthNotification();
//     } else {
//         TOKEN = token;
//         if (TOKEN) {
//             getUnreadMessages();
//             setInterval(function () { getUnreadMessages() }, 5000 * 10);
//         }
//     }
// }

// function updateLabelCount(token) {
//     get({
//         'url': 'https://www.googleapis.com/gmail/v1/users/me/labels/INBOX',
//         'callback': updateLabelCountCallback,
//         'token': token,
//     });
// }

// function updateLabelCountCallback(label) {
//     setBadgeCount(label.threadsUnread);
// }

// function getProfile(token) {
//     get({
//         'url': 'https://www.googleapis.com/plus/v1/people/me',
//         'callback': getProfileCallback,
//         'token': token,
//     });
// }

function clearStorage() {
    chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
            console.error("Error clearing local storage:", chrome.runtime.lastError);
        } else {
            console.log("Local storage cleared.");
        }
    });
}
async function getAuthTokenSilentCallback(token) {
    
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        TOKEN = token;
        saveTokenToStorage(token);
        await saveMessageHistoryToStorage
        if (TOKEN) {
            getUnreadMessages();
            setInterval(function () { getUnreadMessages() }, 5000 * 10);
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
    chrome.notifications.create(options.id, notificationOptions, function (notificationId) { 
        console.log(options)
        if(notificationId == 'start-auth') {
            // getAuthTokenInteractive();
        }
    });
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
            for (let k = 0; k < result.length; k++) {
                const item = result[k];
                if (!Object.keys(message_history).includes(item.message_id)) {
                    const schedule_date = await getResponseFromAI(
                        BASIC_PROMPT.replace("{{CONTEXT}}", item.content).replace("{{DATETIME}}", item.date)
                    )
                    item["schedule_date"] = schedule_date.replace("\n", "");
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

const saveTokenToStorage = (token) => {
    return toPromise((resolve, reject) => {
        chrome.storage.local.set({ [TOKEN_KEY]: token }, () => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
            resolve(token);
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
    let content = decodeBase64(data.payload.parts[0].body.data);
    return {
        internal_date: data.internalDate,
        iso_date: convertDateToIso(Number(data.internalDate)),
        content: content ? content : data.snippet,
        subject: converted_headers.Subject,
        from: converted_headers.From,
        date: converted_headers.Date,
        to: converted_headers.To,
        message_id: id,
        notification_period: NOTIFICATION_DEFAULT_PERIOD
    }
}

function decodeBase64(base64String) {
    try {
        const decodedData = atob(base64String);
        return decodedData;
    } catch (error) {
        return null;
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
        // throw new Error(`${response}`);
        console.log("Error");
        return "no_schedule";
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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

    } else if (message.action == "check_token") {
        const token = await getStorageData(TOKEN_KEY);
        if(!token) {
            getAuthTokenSilent();
        }
    }
});

function setBadge(options) {
    chrome.browserAction.setBadgeText({ 'text': options.text });
    chrome.browserAction.setBadgeBackgroundColor({ 'color': options.color });
    chrome.browserAction.setTitle({ 'title': options.title });
}

async function sheduleNotification() {
    const messages = await getAvailableMessages();
    if (Object.keys(messages).length == 0) {
        SCHEDULE_SET_TIMEOUT = setTimeout(sheduleNotification, 5000)
    } else {
        SCHEDULE_NOTIFICATION_OPTION = messages[0];
        let period = SCHEDULE_NOTIFICATION_OPTION.period ? SCHEDULE_NOTIFICATION_OPTION.period : NOTIFICATION_DEFAULT_PERIOD;
        setTimeout(showScheduleNotification, period);         
    }
}


function showScheduleNotification() {
    var options = {
        'id': (new Date()).getTime().toString()+"_"+SCHEDULE_NOTIFICATION_OPTION.message_id+"_"+SCHEDULE_NOTIFICATION_OPTION.to,
        'iconUrl': '../img/developers-logo.png',
        'title': SCHEDULE_NOTIFICATION_OPTION.subject,
        'message': SCHEDULE_NOTIFICATION_OPTION.content,
    };
    createBasicNotification(options);
    sheduleNotification();
}

async function getAvailableMessages() {
    const message_history = await getStorageData(MESSAGE_HISTORY_KEY);
    const sortedEntries = Object.entries(message_history)
        .sort(([, a], [, b]) => {
            const dateA = new Date(a['schedule_date']);
            const dateB = new Date(b['schedule_date']);
            return dateA - dateB; // ASC order
        });
    const future_ = Object.fromEntries(sortedEntries);
    const filtered = [];
    Object.keys(future_).map((key) => {
        if (!future_[key].completed) filtered.push(future_[key])
    })
    return filtered;
}

function notificationClicked(notificationId){
    const message_id = notificationId.split("_")[1];
    const user = notificationId.split("_")[2];
    chrome.tabs.create({ url: `https://mail.google.com/mail?authuser=${user}#all/${message_id}`  });
}

getAuthTokenSilent();
sheduleNotification();
chrome.notifications.onClicked.addListener(notificationClicked);
chrome.alarms.create('update-count', { 'delayInMinutes': 15, 'periodInMinutes': 15 });
