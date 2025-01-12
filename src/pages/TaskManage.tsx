import { useEffect, useState } from 'react';
import { Button, Drawer } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Flex } from '@mantine/core';
import { Badge, Box, NavLink } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { Message } from '../types';

function TaskManage() {

    const [value, setValue] = useState<Date | null>(null);
    const [messageHistory, setMessageHistory] = useState<any>([]);
    const [openContent, setOpenContent] = useState<boolean>(false);
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
                    messageHistory.map((message: Message) =>
                        <TaskItem 
                            message={message} 
                            openContent={() => {setOpenContent(prev => !prev)}}
                        />
                    )
                }
            </ScrollArea>
            <Drawer opened={openContent} onClose={() => {setOpenContent(prev => !prev)}} size={'100%'}>
                {/* Drawer content */}
            </Drawer>
        </div>
    )
}

export default TaskManage;