import { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Text } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { InitialMessage, Message } from '../types';
import { IconPlus } from '@tabler/icons-react';
import Feedback from '../components/TaskManager/Feedback';
import NewTask from '../components/TaskManager/NewTask';

const messages = new Messages();

function TaskManage() {

    const [messageHistory, setMessageHistory] = useState<any>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<Message>(InitialMessage);
    const [selectedPage, setSelectedPage] = useState<string>("");

    useEffect(() => {
        fetchMessages();
    }, [])

    const newTask = () => {

    }
    const fetchMessages = async() => {
        const message_history = await messages.getMessages();
        console.log(message_history);
        setMessageHistory(message_history.sort((a: Message, b: Message) => {
            const dateA: any = new Date(Number(a['internal_date']));
            const dateB: any = new Date(Number(b['internal_date']));
            return dateB - dateA; // Descending order
        }))
    }
    const usePage = () => {

    }

    useEffect(() => {

    }, [selectedPage])

    const handleFeedback = () => {

    }

    const handleNewTask = () => {

    }

    const handleComplete = async (index: number) => {
        const message_id = messageHistory[index].message_id;
        const message_history = await messages.getMessages(false);
        console.log(messageHistory);
        console.log(message_id);
        const selected_message = message_history[message_id]; selected_message["completed"] = true;
        message_history[message_id] = selected_message;
        const stauts = await messages.saveDataStorage(message_history);
        fetchMessages();
    }

    const DrawerPage = () => {
        let component;
        switch (selectedPage) {
            case "feedback":
                component = <Feedback 
                    message={selectedMessage}
                    handleFeedback={handleFeedback}
                />
                break;
            case "":
                component = <NewTask 
                    handleNewTask={handleNewTask}
                />
                break;
            default:
                component = <NewTask 
                handleNewTask={handleNewTask}
            />
        }
        return component;
    }

    return (
        <div>
            <ScrollArea h={420}>
                {
                    messageHistory.map((message: Message, index: number) =>
                        <TaskItem
                            message={message}
                            index={index}
                            feedback={(index) => {
                                setSelectedPage("feedback");
                                setOpenDrawer(prev => !prev);
                                setSelectedMessage(messageHistory[index])
                            }}
                            completedTask={(index) => { handleComplete(index)}}
                            selectMessage={(index) => {
                                setOpenDrawer(prev => !prev);
                                setSelectedMessage(messageHistory[index])
                            }}
                        />
                    )
                }
            </ScrollArea>

            <Flex
                sx={(theme) => ({
                    position: 'absolute',
                    bottom: '40px',
                    right: '20px',
                    boxShadow: "0 0 6px rgba(0,0,0,.16),0 6px 12px rgba(0,0,0,.32)",
                    padding: '15px',
                    borderRadius: '100%',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.8)'
                })}
                onClick={() => {
                    setOpenDrawer(true);
                    setSelectedPage("new_task");
                }}
            >
                <IconPlus size={"2rem"} />
            </Flex>
            <Drawer
                opened={openDrawer}
                onClose={() => { setOpenDrawer(prev => !prev) }}
                size={'100%'}
            >
                {
                    DrawerPage()
                }
            </Drawer>
        </div>
    )
}

export default TaskManage;