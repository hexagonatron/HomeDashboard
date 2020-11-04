import React from 'react';
import {DateObj} from '../types/sessions';
import {FilterObj} from '../types/filter';
import MovieContainer from './MovieContainer';

type DateContainerProps = {
    sessions: DateObj,
    filter: FilterObj
}

export const DateContainer = (props: DateContainerProps) => {
    return (
        <div className="mt-20 pt-20 ml-0 mr-0 content">
            <div className="ml-0 mr-0 mt-20">
                <div className="row">
                    {props.sessions.movies.map((movie, i) => <MovieContainer key={i} movie={movie} />)}
                </div>
            </div>
        </div>
    );
}

export default DateContainer;