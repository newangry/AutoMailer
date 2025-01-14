import { Button, Flex, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { IconClock, IconEdit, IconMenuOrder, IconPlus, IconRepeat } from "@tabler/icons-react";
import { useState } from "react";

interface NewTaskProps {
    handleNewTask: () => void
}

const NewTask: React.FC<NewTaskProps> = ({ }) => {
    const form = useForm({
        initialValues: {
            title: '',
            job: '',
            email: '',
            favoriteColor: '',
            age: 18,
        },

        validate: {
            title: hasLength({ min: 2, max: 80 }, 'Name must be 2-80 characters long'),
        },
    });

    const [value, setValue] = useState<Date | null>(null);

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
                    withAsterisk
                    mt="md"
                    w={'100%'}
                    {...form.getInputProps('title')}
                />
                <Flex
                    gap={15}
                    align={'center'}
                >
                    <IconClock />
                    <Flex
                        gap={10}
                        align={'center'}
                    >
                        <DateInput
                            clearable
                            placeholder="Date input"
                            maw={'70%'}
                            w={'70%'}
                        />
                        <TimeInput withSeconds w={'27%'} maw={'27%'} mx="auto" />
                    </Flex>
                </Flex>
                <Flex
                    gap={15}
                    align={'center'}
                >
                    <IconEdit />
                    <Textarea
                        w={'100%'}
                    />
                </Flex>
                <Button
                    leftIcon={<IconPlus />}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 20,
                        bottom: 20
                    })}
                >
                    Add
                </Button>
            </Flex>
        </div>

    )
}

export default NewTask;