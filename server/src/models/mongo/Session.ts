import mongoose, { Schema, Document } from 'mongoose';
import moment, { Moment } from 'moment';

export interface ISession extends Document {
    title: string,
    poster_url: string,
    location: string,
    time: Moment,
    imdb_id: string,
    tags: string[],
    booking_url: string
}

const SessionSchema: Schema = new Schema({
    title: { type: String },
    poster_url: { type: String },
    location: { type: String },
    time: { type: Date, get: (time: Date) => moment(time)},
    imdb_id: { type: String },
    tags: { type: Array },
    booking_url: { type: String }
});

SessionSchema.post('init', (session: ISession) => {
    session.time = moment(session.time);
})

export default mongoose.model<ISession>("Session", SessionSchema);

