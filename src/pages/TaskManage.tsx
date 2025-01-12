import { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Text } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { Message } from '../types';
import { IconPlus } from '@tabler/icons-react';

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
    
    const newTask = () => {

    }

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
            
            <Flex
                sx={(theme)=>({
                    position: 'absolute',
                    bottom: '40px',
                    right: '20px',
                    boxShadow: "0 0 6px rgba(0,0,0,.16),0 6px 12px rgba(0,0,0,.32)",
                    padding: '15px',
                    borderRadius: '100%',
                    cursor: 'pointer',
                })}
                onClick={() => {
                    
                }}
            >
                <IconPlus size={"2rem"} />
            </Flex>
            <Drawer 
                opened={openContent} 
                onClose={() => {setOpenContent(prev => !prev)}} 
                size={'100%'}
            >
                
            </Drawer>
        </div>
    )
}

export default TaskManage;