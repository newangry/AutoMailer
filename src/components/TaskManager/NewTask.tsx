import { Button, Flex, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput, DateTimePicker, TimeInput } from "@mantine/dates";
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { IconClock, IconEdit, IconMenuOrder, IconPlus, IconRepeat } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { InitNewTaskItem, Message, NewTaskItemProps } from "../../types";

interface NewTaskProps {
    handleNewTask: (task: Message) => void
    updateTaskType: string,
    task: Message
}

const NewTask: React.FC<NewTaskProps> = ({ handleNewTask, updateTaskType, task }) => {

    const [form, setForm] = useState<NewTaskItemProps>(
        updateTaskType == "add" ? InitNewTaskItem : {
            title: task.subject,
            content: task.content,
            date: task.schedule_date ? 
                    task.schedule_date.indexOf("no_schedule") > -1 ? new Date().toISOString() : task.schedule_date :
                    new Date().toISOString()
        }
    )
    
    const [periodType, setPeriodType] = useState<string>(
        updateTaskType == "add" ? "Hour" : "Minute"
    );
    const [period, setPeriod] = useState<number>(
        updateTaskType == "add" ? 1 : task.notification_period / 1000 / 60
    );
    const [isSchedule, setIsSchedule] = useState<boolean>(false);

    useEffect(() => {
        if (updateTaskType != "add") {
            setIsSchedule(
                task.schedule_date ? task.schedule_date.indexOf("no_schedule") > -1 ? false : true : false
            )
        }
    }, [])

    const addTask = async () => {
        const task_: Message = {
            notification_period: periodType == "Hour" ? period * 60 * 60 * 1000 : period * 60 * 1000,
            subject: form.title,
            content: form.content,
            schedule_date: form.date,
            completed: false,
            from: "added",
            to: "added",
            iso_date: new Date().toISOString(),
            date: new Date().toISOString(),
            message_id: new Date().getTime().toString(),
            internal_date: new Date().getTime().toString()
        }
        handleNewTask(task_);
    }

    const updateTask = async () => {
        task.subject = form.title;
        task.content = form.content;
        task.schedule_date = form.date,
        task.notification_period = periodType == "Hour" ? period * 60 * 60 * 1000 : period * 60 * 1000;
        handleNewTask(task);
    }

    return (
        <div
            style={{ margin: 'auto', width: '80%' }}
        >
            <Flex
                direction={'column'}
                gap={25}
            >
                <TextInput
                    placeholder="Title"
                    value={form.title}
                    onChange={(event) => {
                        const form_ = JSON.parse(JSON.stringify(form));
                        form_["title"] = event.currentTarget.value;
                        setForm(form_);
                    }}
                />
                <Flex
                    gap={15}
                    align={'center'}
                >
                    <IconClock />
                    <DateTimePicker
                        value={new Date(form.date)}
                        onChange={(value) => {
                            const form_ = JSON.parse(JSON.stringify(form));
                            form_["date"] = value?.toISOString();
                            setForm(form_);
                        }}
                        error={
                            isSchedule ? "" :"* No Scheduled"
                        }
                    />
                </Flex>
                <Flex
                    gap={15}
                    align={'center'}
                >
                    <IconRepeat />
                    <Flex
                        gap={15}
                    >
                        <Select
                            data={['Hour', 'Minute']}
                            value={ periodType }
                            onChange={(value) =>{
                                setPeriodType(value? value:"Hour")
                            }}
                        />
                        <NumberInput
                            value={period}
                            onChange={(value) => {
                                setPeriod(value? value:1)
                            }}
                            
                        />
                    </Flex>
                </Flex>
                <Flex
                    gap={15}
                    align={'center'}
                >
                    <IconEdit />
                    <Textarea
                        w={'100%'}
                        onChange={(event) => {
                            const form_ = JSON.parse(JSON.stringify(form));
                            form_["content"] = event.currentTarget.value;
                            setForm(form_);
                        }}
                        value={form.content}
                        h={250}
                    />
                </Flex>
                <Button
                    leftIcon={updateTaskType == "add" ? <IconPlus /> : <IconEdit />}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 20,
                        bottom: 20
                    })}
                    onClick={() => {
                        updateTaskType == "add" ? addTask() : updateTask()
                    }}
                >
                    {
                        updateTaskType == "add" ? "Add" : "Update"
                    }
                </Button>
            </Flex>
        </div>

    )
}

export default NewTask;