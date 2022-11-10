import React, {useState} from 'react';
import {DatePicker} from './DatePicker';
import './App.css'

const App = () => {
    const [date, setDate] = useState(() => new Date());

    return (
        <>
            <DatePicker value={date} onChange={setDate}/>
        </>
    );
};

export default App;