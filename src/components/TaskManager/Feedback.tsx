import { Button, Flex, Paper, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Message } from "../../types";
import { useRef } from "react";
import { IconSend } from "@tabler/icons-react";
interface FeedbackProps {
    message: Message,
    handleFeedback: () => void
}

const Feedback: React.FC<FeedbackProps> = ({ message, handleFeedback }) => {
    const form = useForm({
        initialValues: { name: '', email: '', age: 0 },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
        },
    });
    const ref = useRef<HTMLTextAreaElement>(null);
    
    return (
        <Flex
            direction={'column'}
            w={'100%'}
            gap={20}
        >
            <Paper shadow="xs" p="md">
                <Text w={'bold'}>{message.subject}</Text>
                <Text
                    dangerouslySetInnerHTML={{
                        __html: message.content
                    }}
                >
                </Text>
            </Paper>
            <TextInput
                label="Email"
                placeholder="Email"
                {...form.getInputProps('email')}
            />
            <Textarea 
                ref={ref}
                maxRows={40}
                label="Description"
            />
            <Button
                leftIcon={<IconSend />}
                sx={(theme) =>({
                    position: 'absolute',
                    right: 20,
                    bottom: 20
                })}
            >
                Send
            </Button>
        </Flex>
    )
}

export default Feedback;