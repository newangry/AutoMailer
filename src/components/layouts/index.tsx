import { useContext, useEffect, useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    NavLink,
    Flex,
    Menu,
    ActionIcon,
    Loader,
} from '@mantine/core';
import { FC } from 'react';
import { IconDotsVertical, IconList, IconPlus, IconRefresh, IconSettings, IconUpload } from '@tabler/icons-react';
import HomeContext from '../../state/index.context';
interface Props {
    children: JSX.Element,
}
const PAGES = [
    {
        name: 'task_management', icon: <IconList size="1.125rem" stroke={1.5} />, label: "Task Management"
    },
    {
        name: 'settings', icon: <IconSettings size="1.125rem" stroke={1.5} />, label: "Settings"
    }
]
const Layout: FC<Props> = ({ children }) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const {
        state: { page, is_progress, get_data },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        setOpened(false);
    }, [page])

    useEffect(() => {
        chrome.runtime.sendMessage({ action: "check_token" }, (response) => {
            
        });
    }, [])

    return (
        <div>
            {
                is_progress ? <Loader variant='bars' sx={(theme)=>({
                    position: 'absolute',
                    top: '50%',
                    left: '50%'
                })}/> :
                    <AppShell
                        styles={{
                            main: {
                                background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                            },
                        }}
                        navbarOffsetBreakpoint="sm"
                        asideOffsetBreakpoint="sm"
                        header={
                            <Header height={{ base: 50, md: 70 }} p="md">
                                <Flex
                                    justify={'space-between'}
                                    align={'center'}
                                >
                                    <Flex>
                                        <Text
                                            size={25}
                                        >
                                            AutoMailer
                                        </Text>
                                    </Flex>
                                    <Flex
                                        gap={'15px'}
                                    >
                                        <ActionIcon>
                                            <IconRefresh
                                                size="1.6rem"
                                                onClick={() => {
                                                    homeDispatch({
                                                        "field": "get_data",
                                                        "value": true
                                                    })
                                                }}
                                            />
                                        </ActionIcon>
                                        <ActionIcon>
                                            <IconUpload
                                                size="1.6rem"
                                                onClick={() => {
                                                    window.open("https://gmail.com")
                                                }}
                                            />
                                        </ActionIcon>
                                        <Menu shadow="md" width={200}>
                                            <Menu.Target>
                                                <ActionIcon>
                                                    <IconDotsVertical size="1.6rem" />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                {
                                                    PAGES.map((item) =>
                                                        <Menu.Item icon={item.icon}
                                                            onClick={() => {
                                                                homeDispatch({
                                                                    "field": "page",
                                                                    "value": item.name
                                                                })
                                                            }}
                                                        >{item.label}</Menu.Item>
                                                    )
                                                }
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Flex>
                                </Flex>
                            </Header>
                        }
                    >
                        {
                            children
                        }
                    </AppShell>
            }
        </div>

    )
}

function MyHeader() {
    const {
        state: { page },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const renderTool = () => {
        if (page == "task_management") {
            return <IconPlus style={{ cursor: 'pointer' }} />
        } else {
            return <></>
        }
    }
    return (
        <Flex
            justify={'space-between'}
            w={'100%'}
            align={'center'}
        >
            <Text>
                {PAGES.filter((item) => item.name == page)[0].label}
            </Text>
            {renderTool()}
        </Flex>
    )
}

export default Layout;