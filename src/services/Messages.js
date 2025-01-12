class Messages {
    getMessages = async () => {
        const data = await this.getStorageData('message_history');
        const converted = this.getArrayMessageList(data);
        return converted;        
    }
    getArrayMessageList = (messages) => {
        const data = [];
        for(let key in messages) {
            data.push(messages[key]);
        };
        return data;
    }
    getStorageData = async (key) => {
        return this.toPromise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                const researches = result[key] ?? {};
                resolve(researches);
            });
        });
    }
    toPromise = (callback) => {
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
}

export default Messages;