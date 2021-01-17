import 'reflect-metadata';
import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/core';
import { Session } from './entities/Session';
import { __prod__ } from './constants/constants';

const main = async () => {

    dotenv.config();
    
    // const MONGODB_URI = process.env.MONGODB_URI;
    // const PORT = process.env.PORT;

    // console.log(MONGODB_URI);
    
    // const app = express();
    
    // app.use(express.json());
    
    // app.use(routes);
    
    const orm = await MikroORM.init({
        entities: [Session],
        dbName: "movietimedb",
        type: "mongo",
        debug: !__prod__,
        clientUrl: "mongodb://192.168.178.48/movietimedb"
        
    });

    const session = orm.em.create(Session, {title: "Hello"});
    orm.em.persistAndFlush(session);
    // if (process.env.NODE_ENV === "production") {
    //     app.use(express.static("../client/build"));
    // }
    
    // app.get("*", (req, res) => {
    //     res.sendFile(path.join(__dirname, "../client/build/index.html"));
    // });
    
    // mongoose.connect(MONGODB_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }).then(() => {
    //     app.listen(PORT, () => {
    //         console.log(`Server running on ${PORT}`);
    //     });
    // });
}

main();