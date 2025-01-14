export interface Message {
    internal_date: string,
    iso_date: string,
    content:string,
    subject: string,
    from: string,
    date: string,
    message_id: string,
    schedule_date: string,
    completed: boolean
}

export const InitialMessage: Message = {
    internal_date: "",
    iso_date: "",
    content: "",
    subject: "",
    from: "",
    date: "",
    message_id: "",
    schedule_date: "no_schedule",
    completed: false
}
export interface CheckFilterProps {
    label: string,
    value: boolean,
    name: string
}
