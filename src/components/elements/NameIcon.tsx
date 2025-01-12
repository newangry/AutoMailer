import { Flex, Text } from "@mantine/core";
import { getRandomDarkBackgroundColor } from "../../utils/global";
interface NameIconProps {
    text: string,
    size?:number,
}
const NameIcon: React.FC<NameIconProps> = ({ text, size }) => {
    return (
        <Flex
            w={size ? size : 40}
            h={size ? size : 40}
            sx={(theme) => ({
                borderRadius: size ? size : 40,
                background: getRandomDarkBackgroundColor()
            })}
            direction={'column'}
            align={'center'}
            justify={'center'}
        >
            <Text
                size={size ? size - 15 : 40 - 15}
                color="white"
            >
                {text}
            </Text>
        </Flex>
    )
}

export default NameIcon;