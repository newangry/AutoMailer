import { Badge, Flex, Text } from "@mantine/core";
import { Message } from "../../types";
import { formatDate } from "../../utils/global";
import React from "react";
import NameIcon from "../elements/NameIcon";
interface TaskItemProps {
    message: Message;
    selectMessage: (id: number) => void,
    index: number
}
const TaskItem: React.FC<TaskItemProps> = ({ message, selectMessage, index }) => {
    return (
        <Flex
            p={10}
            justify={'space-between'}
            w={'100%'}
            gap={15}
            sx={(theme) => ({
                cursor: 'pointer',
                '&:hover': {
                    background: "rgba(239,222,222,.5)"
                },
                borderBottom: '1px solid rgba(239,222,222)'
            })}
            onClick={() => {
                selectMessage(index)
            }}
        >
            <Flex
                gap={20}
            >
                <Flex>
                    <NameIcon 
                        text={ message.from.slice(0, 1) }
                    />
                </Flex>
                <Flex
                    direction={'column'}
                    align={'flex-start'}
                >
                    <Text weight={'bold'}>
                        {message.from}
                    </Text>
                    <Text weight={'bold'}>
                        {message.subject.length > 80 ? message.subject.slice(0, 80) + "..." : message.subject}
                    </Text>
                    <Text dangerouslySetInnerHTML={{
                        __html: message.content.length > 160 ? message.content.slice(0, 160) + "..." : message.content
                    }}>
                    </Text>
                </Flex>
            </Flex>
            <Flex
                direction={'column'}
                gap={10}
            >
                <Badge color="blue">New</Badge>
                <Text>
                    {formatDate(Number(message.internal_date))}
                </Text>
            </Flex>
        </Flex>
    )
}

export default TaskItem;