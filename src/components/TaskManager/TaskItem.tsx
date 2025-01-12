import { Flex, Text } from "@mantine/core";
import { Message } from "../../types";
import React from "react";
interface TaskItemProps {
    message: Message;
    selectMessage: (id: number) => void,
    index: number
}
const TaskItem: React.FC<TaskItemProps> = ({ message, selectMessage, index }) => {
    return (
        <Flex
            align={'center'}
            p={10}
            justify={'space-between'}
            w={'100%'}
            sx={(theme) => ({
                cursor: 'pointer',
                '&:hover': {
                    background: "rgba(34,139,230,.15)"
                }
            })}
            onClick={() => {
                selectMessage(index)
            }}
        >
            <Flex
                direction={'column'}
                align={'flex-start'}
                w={"60%"}
            >
                <Text weight={'bold'}>
                    {message.from}
                </Text>
                <Text weight={'bold'}>
                    {message.subject}
                </Text>
                <Text >
                    {message.content}
                </Text>
            </Flex>
            <Flex
                direction={'column'}
                w={'30%'}
            >
                <Text>
                    {message.iso_date}
                </Text>
            </Flex>
        </Flex>
    )
}

export default TaskItem;