import { gql } from 'apollo-server-express';
import Session from '../mongo/Session';
import db from "../mongo";
import {momentObjectFromDateString, validateAndParseQueryDate} from "../../helpers/dateHelpers";
import { getWeekTimeFilter, getDateTimeFilter} from "../../helpers/mongoQueryHelpers";

const typeDefs = gql`
    type Sessions {
        _id: ID!
        title: String!
        poster_url: String!
        location: String!
        time: String!
        imdb_id: String!
        tags: [String]!
        booking_url: String!
    }
    
    type Query {
        getSessionsForNextWeek: [Sessions] 
        getSessionsForDate: [Sessions] 
    }
`;

const resolvers = {
    Query: {
        getSessionsForNextWeek: () => {
        return Session
            .find({
                      time: getWeekTimeFilter()
            })
        },
        getSessionsForDate: (dateString: string) => {
            const parsedDate = validateAndParseQueryDate(dateString)
            return Session.find({
                                    time: getDateTimeFilter(parsedDate)
            })
        }
    }
}

export default {
    typeDefs,
    resolvers
};