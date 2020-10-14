import React, {Dispatch, SetStateAction} from 'react';
import { FilterObj } from '../types/filter';
import { DateObj } from '../types/sessions';
import _ from 'lodash';

type FilterToggleProps = {
    filter: FilterObj,
    sessions: DateObj,
    setFilter: Dispatch<SetStateAction<FilterObj>>
}

export const FilterToggles = (props: FilterToggleProps) => {

    const uniqueCinemas = _.uniq(props.sessions.movies.map(movie => movie.locations.map(location => location.location)).flat()).sort();

    const uniqueTags = _.uniq(props.sessions.movies.map(movie => movie.locations.map(location => location.sessions.map(session => session.tags))).flat(3)).sort();

    const toggleHandler = (cinema: string, checked: boolean) => {
        
        props.setFilter({
            ...props.filter
        })
    }

    return (
        <div className="containter-fluid">
            <div className="row">
                <div className="col">
                    <details className="collapse-panel w-full mt-20">
                        <summary className="collapse-header">Cinemas</summary>
                        <div className="collapse-content">
                            {uniqueCinemas.map((cinema, i) => (
                                <div className="custom-switch mb-5" key={i}>
                                    <input type="checkbox" id={`cinema-switch-${i}`} onChange={(e) => toggleHandler(cinema, e.currentTarget.checked)} />
                                    <label htmlFor={`cinema-switch-${i}`}>{cinema}</label>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
                <div className="col">
                    <details className="collapse-panel w-full mt-20">
                        <summary className="collapse-header">Tags</summary>
                        <div className="collapse-content">
                            {uniqueTags.map((tag, i) => (
                                <div className="custom-switch mb-5" key={i}>
                                    <input type="checkbox" id={`tag-switch-${i}`} onChange={(e) => toggleHandler(tag, e.currentTarget.checked)} />
                                    <label htmlFor={`tag-switch-${i}`}>{tag}</label>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
                <div className="col">
                    <details className="collapse-panel w-full mt-20">
                        <summary className="collapse-header">Genres</summary>
                        <div className="collapse-content">
                            Coming soon....
                        </div>
                    </details>
                </div>
            </div>
        </div>
    )
}

export default FilterToggles;