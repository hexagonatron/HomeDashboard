import React, { useEffect, useState } from 'react';
import * as Api from '../api';
import { SessionResponseJson, DateObj } from '../types/sessions';
import DateButtons from '../components/DateButtons';
import DateContainer from '../components/DateContainer';

export const SessionsByDate = () => {
    const [sessions, setSessions] = useState<DateObj[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateObj>();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const setSelectedDateHandler = (index: number) => {
        setSelectedIndex(index)
        setSelectedDate(sessions[index]);
    }

    useEffect(() => {
        Api.getSessionsByDate()
            .then((sessions: SessionResponseJson) => {
                setSessions(sessions.dates);
                setSelectedDate(sessions.dates[0]);
            })
    }, []);

    return (
        <div className="container mt-20">
            {sessions.length > 0 && <DateButtons dates={sessions} selectedIndex={selectedIndex} setIndex={setSelectedDateHandler} />}
            {!!selectedDate && <DateContainer sessions={selectedDate} />}

        </div>
    )
}

export default SessionsByDate;