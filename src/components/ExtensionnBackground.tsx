import { useEffect } from "react";
import { CLIENT_ID } from "../utils/consts";

function ExtensionnBackground() {
    useEffect(() => {
        const fetchData = async() => {
            
        }
        fetchData();
    }, [])

    const fetchData = async() => {
        function fetchInboxMessageIds(authToken: string, messageIds: any = [], pageToken = '') {
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
                        messageIds = [...messageIds, ...(data.messages || []).map((m: { id: any; }) => m.id)];
                        if (data.nextPageToken) {
                            resolve(fetchInboxMessageIds(authToken, messageIds, data.nextPageToken));
                        } else {
                            resolve(messageIds);
                        }
                    })
                    .catch(reject);
            });
        }
        const messageIds = await fetchInboxMessageIds(CLIENT_ID);
        console.log(messageIds);
    }
    return (
        <div>
            <button style={{top: '100px', position: 'absolute'}} onClick={() => {fetchData()}}>123</button>
        </div>
    )
}

export default ExtensionnBackground;