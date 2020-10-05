import React from 'react';
import { MovieObj } from '../types/sessions';
import LocationContainer from './LocationContainer';

type MovieContainerProps = {
    movie: MovieObj
}

export const MovieContainer = (props: MovieContainerProps) => {
    return (
        <div className="card">
            <div className="row">

                <div className="col-3 text-center pr-20">
                    <h4 className="mt-0">
                        {props.movie.title}
                    </h4>
                    {!!props.movie.poster_url && <img className="img-fluid" src={props.movie.poster_url}/>}

                </div>
                <div className="col-9 pl-10 mt-20">
                    {props.movie.locations.map((location, i) => <LocationContainer location={location} />)}
                </div>
            </div>
        </div>
    )
}

export default MovieContainer;