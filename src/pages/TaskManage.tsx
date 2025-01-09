import { useState } from 'react';
import { Button } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Flex } from '@mantine/core';
import { Badge, Box, NavLink } from '@mantine/core';
import { ScrollArea } from '@mantine/core';

function TaskManage() {

    const [value, setValue] = useState<Date | null>(null);

    return (
        <div>
            Task Manage 
            <Flex mih={50}  gap="sm" justify="center" align="flex-start" direction="row" wrap="wrap">
                <DateInput value={value} onChange={setValue} label="" placeholder="StartDate" />
                <DateInput value={value} onChange={setValue} label="" placeholder="EndDate" />
                <Button variant="filled">Search</Button>
            </Flex>
            <ScrollArea h={250}>
                <Flex mih={50}  gap="sm" justify="center" align="flex-start" direction="row" wrap="wrap">
                    <NavLink label="Happy 2025." description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            1  
                        </Badge>
                        }
                    />
                    <NavLink label="With description" description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            3
                        </Badge>
                        }
                    />
                    <NavLink label="With description" description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            3
                        </Badge>
                        }
                    />
                    <NavLink label="With description" description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            3
                        </Badge>
                        }
                    />
                    <NavLink label="With description" description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            3
                        </Badge>
                        }
                    />
                    <NavLink label="With description" description="Additional information" icon={
                        <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                            3
                        </Badge>
                        }
                    />
                </Flex>
            </ScrollArea>
            
        </div>
    )
}

export default TaskManage;