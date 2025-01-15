import { ActionIcon, Badge, Checkbox, Flex, Text, Tooltip } from "@mantine/core";
import { Message } from "../../types";
import { formatDate, formatScheduleTime, checkDateState } from "../../utils/global";
import React from "react";
import NameIcon from "../elements/NameIcon";
import { IconMessage, IconTrash } from "@tabler/icons-react";
interface TaskItemProps {
    message: Message;
    selectMessage: (id: number) => void,
    index: number,
    feedback: (index: number) => void,
    completedTask: (index: number) => void,
    deleteTask: (index: number) => void
}
const TaskItem: React.FC<TaskItemProps> = ({ message, selectMessage, index, feedback, completedTask, deleteTask }) => {

    const scheduleBadge = (schedule_date: string) => {
        if (!schedule_date) return <Badge color="indigo">No shedule</Badge>;
        if (schedule_date.indexOf("no_shedule")) return <Badge color="indigo">No shedule</Badge>;
        const form_date = formatScheduleTime(schedule_date);
        let color = "blue";
        if (form_date.indexOf("Today") > -1) {
            color = "red"
        }
        return <Badge color={color}>
            {form_date}
        </Badge>
    }

    return (
        <Flex
            p={10}
            w={'100%'}
            sx={(theme) => ({
                cursor: 'pointer',
                '&:hover': {
                    background: "rgba(239,222,222,.5)"
                },
                borderBottom: '1px solid rgba(239,222,222)'
            })}
            gap={15}
            align={"center"}
        >
            <Flex
                justify={'space-between'}
                gap={15}
                w={'100%'}
                align={"center"}
            >
                <Flex
                    gap={20}
                >
                    <Flex
                        gap={10}
                        direction={'column'}
                        align={'center'}
                    >
                        <NameIcon
                            text={message.from.slice(0, 1)}
                        />
                        <Tooltip label="Mark Completed" color="gray" position="right">
                            <Checkbox 
                                checked={message.completed}
                                disabled={message.completed}
                                onClick={() => {
                                    completedTask(index)
                                }}
                            />
                        </Tooltip>
                        <Tooltip label="Feedback" color="gray" position="right">
                            <ActionIcon
                            >
                                <IconMessage
                                    onClick={() => { feedback(index) }}
                                />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete" color="gray" position="right">
                            <ActionIcon
                            >
                                <IconTrash
                                    onClick={() => { deleteTask(index) }}
                                />
                            </ActionIcon>
                        </Tooltip>
                    </Flex>
                    <Flex
                        direction={'column'}
                        align={'flex-start'}
                        onClick={() => {
                            selectMessage(index)
                        }}
                    >
                        <Flex
                            gap={20}
                            align={"center"}
                        >
                            <Text weight={'bold'}>
                                {message.from}
                            </Text>
                            {
                                scheduleBadge(message.schedule_date)
                            }
                        </Flex>
                        <Text weight={'bold'}>
                            {message.subject.length > 80 ? message.subject.slice(0, 80) + "..." : message.subject}
                        </Text>
                        <Text dangerouslySetInnerHTML={{
                            __html: message.content.length > 300 ? message.content.slice(0, 300) + "..." : message.content
                        }}>
                        </Text>
                    </Flex>
                </Flex>
                <Flex
                    direction={'column'}
                    gap={10}
                >
                    {
                        message.completed ? <Badge color="green">Completed</Badge>:""
                    }
                    <Badge color={
                        checkDateState(message.schedule_date) == "Past" ? "red" : "blue`"
                    }>
                        {checkDateState(message.schedule_date)}
                    </Badge>
                    <Text>
                        {formatDate(Number(message.internal_date))}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default TaskItem;