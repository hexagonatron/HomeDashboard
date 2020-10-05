import React from 'react';
import {SessionObj} from '../types/sessions'
import moment from 'moment';
import classNames from 'classnames'
import './SessionButton.scss';

type SessionButtonProps = {
    session: SessionObj
}

export const SessionButton = (props: SessionButtonProps) => {
    const timeString = moment(props.session.time, "DD-MM-YYYY H:mm").format("H:mm");
    const hasTags = props.session.tags.length > 0;
    return (
        <a 
            href={props.session.booking_url} 
            className={classNames(
                {tag: hasTags},
                "btn",
                "m-5",
                )}
            data-toggle={hasTags?"tooltip":""}
            data-title={hasTags? props.session.tags.join(", "):""}
        >
            {timeString}
        </a>
    )
}

export default SessionButton