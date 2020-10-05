import React from 'react';
import {LocationObj} from '../types/sessions';
import SessionButton from './SessionButton';

type LocationContainerProps = {
    location: LocationObj
}

export const LocationContainer = (props: LocationContainerProps) => {
    return(
        <div >
            <h5 className="ml-5">
                {props.location.location}
            </h5>
            {props.location.sessions.map((session, i) => <SessionButton session={session} key={i}/>)}
        </div>
    )
}

export default LocationContainer