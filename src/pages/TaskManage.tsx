import { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Text } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { InitialMessage, Message, CheckFilterProps } from '../types';
import { IconPlus } from '@tabler/icons-react';
import Feedback from '../components/TaskManager/Feedback';
import NewTask from '../components/TaskManager/NewTask';
import Filter from '../components/TaskManager/Filter';
import { updateNamedExports } from 'typescript';

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
    
    const filterTasks = async (options: CheckFilterProps[], daterange: any) => {
        let message_history = await messages.getMessages();
        message_history = message_history.sort((a: Message, b: Message) => {
            const dateA: any = new Date(Number(a['internal_date']));
            const dateB: any = new Date(Number(b['internal_date']));
            return dateB - dateA; // Descending order
        });
        let filter_by_daterange: Message[] = [];
        // filter by date range
        message_history.map((item: Message, index: number) => {
            if((new Date(item.date)).getTime() <= daterange[1] && (new Date(item.date)).getTime() >= daterange[0]) {
                filter_by_daterange.push(item);
            }
        });
        console.log(daterange.getDate());
        // filter by options
        let filter_by_options: Message[] = [];
        filter_by_daterange.map((item: Message, index: number) => {
            if(options[0]['value']) { //All
                filter_by_options.push(item)
            } else {
                let passed = false;
                if( options[1]["value"] 
                    && !item.schedule_date
                    && item.schedule_date.indexOf("no_schedule") == -1) {
                    passed = true;
                }
                if(options[2]["value"] 
                    && item.schedule_date
                    && item.schedule_date.indexOf("no_schedule") > -1) {
                    passed = true;
                }
                if(options[3]["value"] && item.completed) {
                    passed = true;
                }
                if(passed) {
                    filter_by_options.push(item);
                }
            }
        })
        setMessageHistory(filter_by_options);
    }

    const handleComplete = async (index: number) => {
        const message_id = messageHistory[index].message_id;
        const message_history = await messages.getMessages(false);
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
            <Filter 
                filterTasks={filterTasks}
            />
            <ScrollArea h={420}>
                {
                    messageHistory.length == 0 ?
                    <Flex
                        h={'100%'}
                        direction={'column'}
                        align={'center'}
                        justify={'center'}
                    >
                        <Text>No Tasks</Text>
                    </Flex>
                    :
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