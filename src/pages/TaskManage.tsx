import { useEffect, useState } from 'react';
import { Button, Drawer } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { Message } from '../types';

function TaskManage() {

    const [messageHistory, setMessageHistory] = useState<any>([]);
    const [openContent, setOpenContent] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<Message>()
    useEffect(() => {
        const fetchMessages = async () => {
            const messages = new Messages();
            const message_history = await messages.getMessages();
            console.log(message_history);
            setMessageHistory(message_history)
        }
        fetchMessages();
    }, [])
    return (
        <div>
            <ScrollArea h={250}>
                {
                    messageHistory.map((message: Message, index: number) =>
                        <TaskItem 
                            message={message} 
                            index={index}
                            selectMessage={(index) => {
                                setOpenContent(prev => !prev); 
                                setSelectedMessage(messageHistory[index])
                            }}
                        />
                    )
                }
            </ScrollArea>
            <Drawer opened={openContent} 
                    onClose={() => {setOpenContent(prev => !prev)}} 
                    size={'100%'}
                    title={selectedMessage?.subject}
            >
                
            </Drawer>
        </div>
    )
}

export default TaskManage;