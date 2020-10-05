import React from 'react';
import { DateObj } from '../types/sessions';
import MovieContainer from './MovieContainer';

type DateContainerProps = {
    sessions: DateObj
}

export const DateContainer = (props: DateContainerProps) => {
    return (<div className="mt-20 pt-20 content">
        <div className="ml-0 mr-0 mt-20">
            {props.sessions.movies.map((movie, i) => <MovieContainer key={i} movie={movie}/>)}
        </div>
    </div>);
}

export default DateContainer;