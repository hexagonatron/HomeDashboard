import React, {useState} from 'react';
import {MovieObj} from '../types/sessions';
import LocationContainer from './LocationContainer';
import classNames from 'classnames';
import styled from 'styled-components';

type MovieContainerProps = {
    movie: MovieObj
}

const HideableDiv = styled.div`
    display: ${({hidden}) => hidden ? 'none' : 'block'}
`;

const HoverableDiv = styled.div`
    cursor: pointer;
    
    &:hover {
    }
`;

const GrowableDiv = styled.div`
    transition-duration: 150ms;
    transition-property: max-width, width;
`


export const MovieContainer = (props: MovieContainerProps) => {
    const [hidden, setHidden] = useState(true);

    return (
        <GrowableDiv
            className={classNames(
                {"col-3": hidden},
                {"col-12": !hidden}
            )}
        >
            <HoverableDiv
                className={classNames(
                    "card bg-light-lm m-5",
                )}
                onClick={() => setHidden(!hidden)}
            >
                <div
                    className="row"
                >
                    <div
                        className={classNames(
                            "text-center pr-20",
                            {"col-12": hidden},
                            {"col-3": !hidden}
                        )}
                    >
                        <h4 className="mt-0">
                            {props.movie.title}
                        </h4>
                        {!!props.movie.poster_url && <img className="img-fluid" src={props.movie.poster_url} />}
                    </div>
                    <HideableDiv
                        className="pl-10 mt-20 col-9"
                        hidden={hidden}
                    >
                        {props.movie.locations.map((location, i) => <LocationContainer key={i} location={location} />)}
                    </HideableDiv>
                </div>
            </HoverableDiv>
        </GrowableDiv>
    )
}

export default MovieContainer;