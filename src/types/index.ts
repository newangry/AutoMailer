export interface Message {
    internal_date: string,
     iso_date: string,
    content:string,
    subject: string,
    from: string,
    date: string,
    message_id: string,
    schedule_date: string,
    completed: boolean,
    notification_period: number,
    to: string
}

export const InitialMessage: Message = {
    internal_date: "",
    iso_date: "",
    content: "",
    subject: "",
    from: "",
    date: "",
    to: "",
    message_id: "",
    schedule_date: "no_schedule",
    completed: false,
    notification_period: 1000 * 60
}
export interface CheckFilterProps {
    label: string,
    value: boolean,
    name: string
}

export interface NewTaskItemProps {
    title: string,
    date: string,
    content: string
}

export const InitNewTaskItem = {
    title: "",
    date: new Date().toISOString(),
    content: "",
}
