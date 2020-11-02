import moment, { Moment } from 'moment';

export const getWeekTimeFilter = () => {
    return {
        $gte: moment(),
        $lte: moment().add(7, 'd').endOf('day')
    }
}

export const getDateTimeFilter = ( date: Moment ) => {
    return {
        $gte: date,
        $lte: date.endOf('day')
    }
}