import { Switch } from '@mantine/core';
import { useState } from 'react';

function Setting() {

    const [checked, setChecked] = useState(false);
    return (
        <div>
            Setting

            <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} label="Notification Alarm" />
        </div>
    )
}
export default Setting;