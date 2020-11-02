import moment,{ Moment } from 'moment';
import { ISession } from '../models/mongo/Session';
import {SessionObj, LocationObj, MovieObj, DateObj, SessionResponseJson} from '../types/session';

interface ISessionHash {
    [date: string] : {
        [title: string] : {
            [location: string] : ISession[]
        }
    }
}

export const formatSessions = (sessions: ISession[]) => {
    const sessionMap: ISessionHash = {};
    for(const session of sessions){
        const day = session.time.format("DD-MM-YYYY");
        const {title, location, imdb_id} = session;
        const titleHash = imdb_id? imdb_id: title.toLowerCase();
        if(!sessionMap[day]){
            sessionMap[day] = {};
        }
        if(!sessionMap[day][titleHash]){
            sessionMap[day][titleHash] = {};
        }
        if(!sessionMap[day][titleHash][location]){
            sessionMap[day][titleHash][location] = [];
        }

        sessionMap[day][titleHash][location].push(session);
    }
    const responseJSON: SessionResponseJson = {
        dates:[]
    };
    for(const date in sessionMap){
        let dateObj: DateObj = {
            date: date,
            movies: []
        }

        for(const title in sessionMap[date]){
            let movieObj: MovieObj = {
                title: title,
                locations: []
            }

            for(const location in sessionMap[date][title]){
                let locationObj: LocationObj = {
                    location: location,
                    sessions: []
                }

                for(const session of sessionMap[date][title][location]){
                    let sessionObj: SessionObj = {
                        time: session.time.format("DD-MM-YYYY HH:mm"),
                        tags: session.tags,
                        booking_url: session.booking_url
                    }
                    locationObj.sessions.push(sessionObj);
                    movieObj.title = session.title;
                    if(!movieObj.poster_url && session.poster_url) movieObj.poster_url = session.poster_url;
                    if(!movieObj.imdb_id && session.imdb_id) movieObj.imdb_id = session.imdb_id;
                }
                locationObj.sessions.sort((a, b) => dateSort(
                    moment(a.time, "DD-MM-YYYY HH:mm"), 
                    moment(b.time, "DD-MM-YYYY HH:mm")
                    ));
                movieObj.locations.push(locationObj);
            }
            movieObj.locations.sort((a, b) => alphabeticalSort(a.location, b.location));
            dateObj.movies.push(movieObj);
        }

        dateObj.movies.sort((a, b) => alphabeticalSort(a.title, b.title));
        responseJSON.dates.push(dateObj);

    }

    responseJSON.dates.sort((a, b) => dateSort(
        moment(a.date, "DD-MM-YYYY"),
        moment(b.date, "DD-MM-YYYY")
    ));
    return responseJSON;
}

const dateSort  = (a : Moment, b: Moment) => {
    return a.isBefore(b)? -1: 1;
}

const alphabeticalSort = (a: string, b: string) => {
    return a.toLowerCase() < b.toLowerCase()? -1: 1;
}



/*
Dates:[
    4-10-20: {
        movies:[
            tenet: {
                cinemas: [
                    norwood: {
                        sessions: [
                            {
                                time:
                                tags: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
]



sessions: [
    {
        date: 4-10-20
        movies:[
            {
                name: tenet,
                cinemas:[
                    {
                        name: norwood,
                        sessions: [
                            {
                                time:
                                tags: []
                                booking: "book.com"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
*/