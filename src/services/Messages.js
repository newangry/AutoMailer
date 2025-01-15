class Messages {

    getMessages = async (is_array = true) => {
        const data = await this.getStorageData('message_history');
        const converted = this.getArrayMessageList(
            data
        );
        if( is_array ) return converted;
        return data;
    }
    
    getArrayMessageList = (messages) => {
        const data = [];
        for(let key in messages) {
            data.push(messages[key]);
        };
        return data;
    }

    saveDataStorage = (messages) => {
        return this.toPromise((resolve, reject) => {
            chrome.storage.local.set({ "message_history": messages }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(messages);
            });
        });
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