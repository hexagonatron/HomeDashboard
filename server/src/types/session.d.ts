import { Moment } from 'moment';

export interface SessionResponseJson {
    dates: DateObj[]
}

export interface SessionObj {
    time: string,
    tags: string[],
    booking_url: string
}

export interface LocationObj {
    location: string,
    sessions: SessionObj[]
}

export interface MovieObj {
    title: string,
    locations: LocationObj[]
    poster_url?: string
    imdb_id?: string
}

export interface DateObj {
    date: string,
    movies: MovieObj[]
}