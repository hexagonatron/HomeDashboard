import React from 'react';
import moment from 'moment';
import { DateObj } from '../types/sessions';
import classNames from 'classnames';

type DateButtonProps = {
    dates: DateObj[],
    selectedIndex: number,
    setIndex: (a:number) => void
}

export const DateButtons = (props: DateButtonProps) => {

    const getDateText = (dateString: string) => {
        const date = moment(dateString, "DD-MM-YYYY");
        if(moment().isSame(date, "day") ) return "Today";
        if(moment().add(1, "day").isSame(date, "day")) return "Tomorrow";
        const dateText = date.format("ddd \n D MMM");
        return dateText
    }

    return (
        <div className="d-flex justify-content-between">
            {props.dates.map((date, i) => (
            <button 
                key={i}
                onClick={() => props.setIndex(i)}
                className={classNames(
                    "btn", 
                    {'btn-primary': props.selectedIndex === i}
                )} 
            >
                {getDateText(date.date)}
            </button>
            ))}
        </div>
    )
}

export default DateButtons;