import { Checkbox, CheckIcon, Flex, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { DateRangePicker } from 'rsuite';
import { CheckFilterProps } from "../../types";

interface FilterProps {
    filterTasks: (check_filter: CheckFilterProps[], daterange: any) => void
}

const Filter: React.FC<FilterProps> = ({ filterTasks }) => {
    const [daterange, setDaterange] = useState<[Date, Date]>([new Date(), addOneDay()])
    const [checkFilter, setCheckFilter] = useState<CheckFilterProps[]>([
        { label: "All", name: "all", value: true },
        { label: "Schedule", name: "schedule", value: false },
        { label: "No Schdule", name: "no_schedule", value: false },
        { label: "Completed", name: "completed", value: false },
    ])
    function addOneDay() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    }
    const handleCheckbox = (index: number) => {
        const check_filter = JSON.parse(JSON.stringify(checkFilter));
        const checked = !check_filter[index]["value"];
        check_filter[index]["value"] = checked;
        if (index == 0 && checked) {
            for (let k = 1; k < check_filter.length; k++) {
                check_filter[k].value = false;
            }
        }
        let check_status = false;
        for (let k = 1; k < check_filter.length; k++) {
            if(check_filter[k].value) check_status = true;
        }
        if(check_status && check_filter[0]["value"]) check_filter[0]["value"] = false;
        
        let checked_index = 0;
        for (let k = 0; k < check_filter.length; k++) {
            if(check_filter[k].value) checked_index++;
        }
        if(checked_index == 0) {
            check_filter[0]["value"] = true;
        }
        setCheckFilter(check_filter);
        filterTasks(check_filter, daterange);
    }

    useEffect(() => {
        filterTasks(checkFilter, daterange);
    }, [daterange])

    return (
        <Flex
            gap={20}
            p={15}
            mb={20}
            align={"center"}
            justify={'space-between'}
        >
            <DateRangePicker
                value={[(new Date(daterange[0])), (new Date(daterange[1]))]}
                onChange={(value, event) => {
                    if (value) setDaterange(value);
                }}
                style={{width: '250px'}}
            />
            {
                checkFilter.map((item: CheckFilterProps, index: number) =>
                    <Checkbox
                        label={item.label}
                        checked={item.value}
                        onChange={(value) => {
                            handleCheckbox(index)
                        }}
                    />
                )
            }
        </Flex>
    )
}

export default Filter;