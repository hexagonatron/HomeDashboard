import db from '../models';
import { invalidDateRange, noSessionsFound } from '../constants/errors';
import moment, { Moment } from 'moment';
import { ISession } from '../models/Session';

export const findSessions = (fromDate: Moment, toDate: Moment) => {
    if (!fromDate.isBefore(toDate)) throw invalidDateRange;

    return new Promise<ISession[]>((resolve, reject) => {

        db.Session.find({time: {$gte: fromDate, $lte: toDate.add(1, "d").subtract(1, "s")}}).then((sessions) => {

            if(sessions.length === 0) return reject(noSessionsFound);

            return resolve(sessions);
        })

    });

}