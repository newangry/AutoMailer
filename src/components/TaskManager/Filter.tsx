import { Checkbox, CheckIcon, Flex, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { DateRangePicker } from 'rsuite';
import { CheckFilterProps } from "../../types";

interface FilterProps {
    filterOptions: CheckFilterProps[],
    handleFilterOptions: (index: number) => void,
    changeDaterang: (daterange: [Date, Date]) => void,
    daterange: [Date, Date]
}

const Filter: React.FC<FilterProps> = ({ daterange, changeDaterang, handleFilterOptions, filterOptions }) => {
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
                    if (value) changeDaterang(value);
                }}
                style={{width: '250px'}}
            />
            {
                filterOptions.map((item: CheckFilterProps, index: number) =>
                    <Checkbox
                        label={item.label}
                        checked={item.value}
                        onChange={(value) => {
                            handleFilterOptions(index)
                        }}
                    />
                )
            }
        </Flex>
    )
}

export default Filter;