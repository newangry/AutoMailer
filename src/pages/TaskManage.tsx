import { useContext, useEffect, useState } from 'react';
import { Button, Drawer, Flex, Text } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import Messages from '../services/Messages';
import TaskItem from '../components/TaskManager/TaskItem';
import { InitialMessage, Message, CheckFilterProps } from '../types';
import { IconPlus } from '@tabler/icons-react';
import Feedback from '../components/TaskManager/Feedback';
import NewTask from '../components/TaskManager/NewTask';
import Filter from '../components/TaskManager/Filter';
import HomeContext from '../state/index.context';

const messages = new Messages();

function TaskManage() {

    const [messageHistory, setMessageHistory] = useState<any>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<Message>(InitialMessage);
    const [selectedPage, setSelectedPage] = useState<string>("");
    const [daterange, setDaterange] = useState<[Date, Date]>([getOffsetDate(-1), getOffsetDate(1)])
    const [updateTaskType, setUpdateTaskType] = useState< "add" | "update">("add");

    const [filterOptions, setFilterOptions] = useState<CheckFilterProps[]>([
        { label: "All", name: "all", value: true },
        { label: "Schedule", name: "schedule", value: false },
        { label: "No Schdule", name: "no_schedule", value: false },
        { label: "Completed", name: "completed", value: false },
    ])

    const {
        state: { get_data },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        filterTasks();
    }, [])

    useEffect(() => {
        if(get_data) filterTasks()
    }, [get_data])

    const fetchMessages = async () => {
        const message_history = await messages.getMessages();
        setMessageHistory(message_history.sort((a: Message, b: Message) => {
            const dateA: any = new Date(Number(a['internal_date']));
            const dateB: any = new Date(Number(b['internal_date']));
            return dateB - dateA; // Descending order
        }))
    }

    function getOffsetDate(offset: number) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + offset);
        return tomorrow;
    }


    useEffect(() => {

    }, [selectedPage])

    useEffect(() => {
        filterTasks();
    }, [filterOptions, daterange])

    const handleNewTask = async (task: Message) => {
        const messages = new Messages();
        const message_history = await messages.getMessages(false);
        message_history[task.message_id] = task;
        await messages.saveDataStorage(message_history);
        filterTasks();
        setOpenDrawer(false);
    }

    const handleFeedback = async () => {
        
    }

    const handleFilterOptions = (index: number) => {
        const check_filter = JSON.parse(JSON.stringify(filterOptions));
        const checked = !check_filter[index]["value"];
        check_filter[index]["value"] = checked;
        if (index == 0 && checked) {
            for (let k = 1; k < check_filter.length; k++) {
                check_filter[k].value = false;
            }
        }
        let check_status = false;
        for (let k = 1; k < check_filter.length; k++) {
            if (check_filter[k].value) check_status = true;
        }
        if (check_status && check_filter[0]["value"]) check_filter[0]["value"] = false;

        let checked_index = 0;
        for (let k = 0; k < check_filter.length; k++) {
            if (check_filter[k].value) checked_index++;
        }
        if (checked_index == 0) {
            check_filter[0]["value"] = true;
        }
        setFilterOptions(check_filter);
    }

    const filterTasks = async () => {
        let message_history = await messages.getMessages();
        message_history = message_history.sort((a: Message, b: Message) => {
            const dateA: any = new Date(Number(a['internal_date']));
            const dateB: any = new Date(Number(b['internal_date']));
            return dateB - dateA; // Descending order
        });

        
        let filter_by_daterange: Message[] = [];
        // filter by date range
        message_history.map((item: Message, index: number) => {
            if ((new Date(item.date)).getTime() <= daterange[1].getTime() && (new Date(item.date)).getTime() >= daterange[0].getTime()) {
                filter_by_daterange.push(item);
            }
        });

        let filter_by_options: Message[] = [];
        filter_by_daterange.map((item: Message, index: number) => {
            if (filterOptions[0]['value']) { //All
                filter_by_options.push(item)
            } else {
                let passed = false;
                if (filterOptions[1]["value"]
                    && item.schedule_date) {
                    if (item.schedule_date.indexOf("no_schedule") == -1) passed = true;
                }
                if (filterOptions[2]["value"]) {
                    passed = item.schedule_date ? item.schedule_date.indexOf("no_schedule") > -1 ? true : false : true;
                }
                if (filterOptions[3]["value"] && item.completed) {
                    passed = true;
                }
                if (passed) {
                    filter_by_options.push(item);
                }
            }
        })
        console.log(filter_by_options);
        setMessageHistory(filter_by_options);
    }

    const handleComplete = async (index: number) => {
        const message_id = messageHistory[index].message_id;
        const message_history = await messages.getMessages(false);
        const selected_message = message_history[message_id]; 
        selected_message["completed"] = true;
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
                    task={selectedMessage}
                    updateTaskType={updateTaskType}
                />
                break;
            default:
                component = <NewTask
                    handleNewTask={handleNewTask}
                    updateTaskType={updateTaskType}
                    task={selectedMessage}
                />
        }
        return component;
    }

    const deleteTask = async(index: number) => {
        const messages = new Messages();
        const message_history = await messages.getMessages(false);
        const message_id = messageHistory[index].message_id;
        delete message_history[message_id];
        await messages.saveDataStorage(message_history);
        filterTasks();
    }

    return (
        <div>
            <Filter
                handleFilterOptions={handleFilterOptions}
                filterOptions={filterOptions}
                daterange={daterange}
                changeDaterang={(daterange_) => {setDaterange(daterange_)}}
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
                                completedTask={(index) => { handleComplete(index) }}
                                selectMessage={(index) => {
                                    setOpenDrawer(prev => !prev);
                                    setUpdateTaskType("update");
                                    setSelectedMessage(messageHistory[index])
                                }}
                                deleteTask={(index: number) => {
                                    deleteTask(index)
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
                    setUpdateTaskType("add");
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