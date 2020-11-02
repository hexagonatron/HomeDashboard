import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {ApolloServer} from 'apollo-server-express';
import path from 'path';

import schema from './models/graphql/schema';

import routes from './routes/routes';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

const app = express();
const apolloServer = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
})

app.use(express.json());

app.use(routes)

apolloServer.applyMiddleware({ app });

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"));
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});