import React from 'react';
import {MovieObj} from '../types/sessions';

type MovieContainerProps = {
    movie: MovieObj
}

export const MovieContainer = (props: MovieContainerProps) => {
    return (
        // <div className="card m-0 mt-20 bg-light-lm">
        //     <div className="row">
        //
        //         <div className="col-3 text-center pr-20">
        //             <h4 className="mt-0">
        //                 {props.movie.title}
        //             </h4>
        //             {!!props.movie.poster_url && <img className="img-fluid" src={props.movie.poster_url}/>}
        //
        //         </div>
        //         <div className="col-9 pl-10 mt-20">
        //             {props.movie.locations.map((location, i) => <LocationContainer key={i} location={location} />)}
        //         </div>
        //     </div>
        // </div>
        <div className="col-3 p-10">
            <details className="collapse-panel" style={{height:'100%'}}>
                <summary className="collapse-header" style={{height:'100%'}}>
                    <h4 className="mt-0 text-center">
                        {props.movie.title}
                    </h4>
                    {!!props.movie.poster_url && <img className="img-fluid" src={props.movie.poster_url} />}
                </summary>
                <div className="collapse-content">
                    Computers are important because they are like bicycles for the mind.
                </div>
            </details>
        </div>
    )
}

export default MovieContainer;