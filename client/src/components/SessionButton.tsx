import React from 'react';
import {SessionObj} from '../types/sessions'
import moment from 'moment';
import classNames from 'classnames'
import './SessionButton.scss';

type SessionButtonProps = {
    session: SessionObj
}

export const SessionButton = (props: SessionButtonProps) => {

    const getTagColor = () => {

        const GOLD_TAGS = ["GC"];
        const GREEN_TAGS = ["XTREME", "Vmax"];
        const PINK_TAGS = ["EXIMAX"];

        const tags = props.session.tags;

        if(!tags.length) return "";

        if(tags.some(tag => GOLD_TAGS.includes(tag))) return "gold";

        if(tags.some(tag => GREEN_TAGS.includes(tag))) return "green";

        if(tags.some(tag => PINK_TAGS.includes(tag))) return "pink";

        if(tags.some(tag => tag.includes("Festival"))) return "crimson";

        return "white";
    }

    const timeString = moment(props.session.time, "DD-MM-YYYY H:mm").format("H:mm");
    const hasTags = props.session.tags.length > 0;
    const tagColor = getTagColor();
    return (
        <a 
            href={props.session.booking_url} 
            className={classNames(
                {tag: hasTags},
                tagColor,
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