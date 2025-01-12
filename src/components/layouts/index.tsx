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
} from '@mantine/core';
import { FC } from 'react';
import { IconList, IconPlus, IconSettings } from '@tabler/icons-react';
import HomeContext from '../../state/index.context';
interface Props {
    children: JSX.Element,
}
const PAGES = [
    {
        name: 'task_management', icon: <IconList size="1rem" stroke={1.5} />, label: "Task Management"
    },
    {
        name: 'settings', icon: <IconSettings size="1rem" stroke={1.5} />, label: "Settings"
    }
]
const Layout: FC<Props> = ({ children }) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const {
        state: { page },
        dispatch: homeDispatch,
    } = useContext(HomeContext);
    
    useEffect(() => {
        setOpened(false);
    }, [page])

    useEffect(() => {
    }, [])

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    {
                        PAGES.map((page_) =>
                            <NavLink
                                label={page_.label}
                                icon={page_.icon}
                                active={page_.name == page ? true : false}
                                onClick={() => {
                                    homeDispatch({
                                        "field": "page",
                                        "value": page_.name
                                    })
                                }}
                            />
                        )
                    }
                </Navbar>
            }
            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        <MyHeader />
                    </div>
                </Header>
            }
        >
            {
                children
            }
        </AppShell>
    )
}

function MyHeader() {
    const {
        state: { page },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const renderTool = () => {
        if (page == "task_management") {
            return <IconPlus style={{cursor: 'pointer'}}/>
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