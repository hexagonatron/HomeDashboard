import React, { useEffect, useState } from 'react';
import * as Api from '../api';
import { SessionResponseJson, DateObj } from '../types/sessions';
import { FilterObj } from '../types/filter';
import DateButtons from '../components/DateButtons';
import DateContainer from '../components/DateContainer';
import FilterToggles from '../components/FilterToggles';

export const SessionsByDate = () => {
    const [sessions, setSessions] = useState<DateObj[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateObj>();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [filter, setFilter] = useState<FilterObj>({
        cinemas: []
    });

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
            {!!selectedDate && <FilterToggles filter={filter} setFilter={setFilter} sessions={selectedDate} />}
            {!!selectedDate && <DateContainer sessions={selectedDate} filter={filter} />}

        </div>
    )
}

export default SessionsByDate;