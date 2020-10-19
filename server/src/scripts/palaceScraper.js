const fetch = require('node-fetch');
const mongoose = require('mongoose');
const {parse} = require('node-html-parser');
const moment = require('moment');
require('dotenv').config();
const { Logger } = require('../../dist/js/helpers/Logger');

const SessionSchema = new mongoose.Schema({
    title: { type: String },
    poster_url: { type: String },
    location: { type: String },
    time: { type: Date },
    imdb_id: { type: String },
    tags: { type: Array },
    booking_url: { type: String }
});


const Session =  mongoose.model("Session", SessionSchema);



const OMDB_API_KEY = process.env.OMDB_API_KEY;

const logger = new Logger();

//Config Vars
const HOYTS_CINEMA_IDS = [
    "NWDCIN", //Hoyts Norwood
    "TTPLZA", //Hoyts TeaTree Plaze
];

const EVENT_CINEMA_IDS = [
    22, // Event Marion
    71, // Moonlight
    88, // GU Film House Adelaide
    87, // GU Film House Glenelg
];

const WALLIS_CINEMA_URLS = [
    "piccadilly",
    "mainline-drive-in"
];

const HOYTS_ID_MAP = {
    "NWDCIN" : "Hoyts Norwood",
    "TTPLZA" : "Hoyts Tea Tree Plaza",
}



const getPalaceTimesAndSave = async () => {
    const palaceHTMLraw = await getPalaceMovieTimes();

    const movieTimes = await parsePalaceHTML(palaceHTMLraw);

    saveSessionTimesToDb(movieTimes);
}

const getHoytsTimesAndSave = async () => {
    const hoytsJson = await getHoytsMovieTimes();

    const movieTimeArray = await parseHoytsJson(hoytsJson);

    saveSessionTimesToDb(movieTimeArray);
}

const getEventTimesAndSave = async () => {
    const eventJsonArray = await getEventMovieTimes();

    const movieTimeArray = await parseEventJson(eventJsonArray);

    saveSessionTimesToDb(movieTimeArray);
}

const getWallisTimesAndSave = async () => {
    const wallisRawHtmlArray = await getWallisHTML();
    
    const movieTimeArray = await parseWallisHTML(wallisRawHtmlArray);

    saveSessionTimesToDb(movieTimeArray);
}

const getPalaceMovieTimes = async () => {
    const response = await fetch('https://palacenova.com.au/showing-this-week').then(res => res.text());

    return response;
}

const getWallisHTML = async () => {

    const htmlArray = WALLIS_CINEMA_URLS.map(cinema => {
        return fetch(`https://www.wallis.com.au/cinemas/${cinema}?sort=title`).then(res => res.text());
    });



    return await Promise.all(htmlArray);
}

const getHoytsMovieTimes = async () => {
    const startDate = moment().format("MM-DD-YYYY");

    const hoytsIdString = HOYTS_CINEMA_IDS.map(id => `cinemaIds=${id}`).join("&");

    const hoytsurl = `https://www.hoyts.com.au/api/movie/all?${hoytsIdString}&numDays=20&retrieveAll=true&startTime=${startDate}`;

    const response = await fetch(hoytsurl).then(res => res.json());

    return response

}

const getEventMovieTimes = async () => {
    const eventIdString = EVENT_CINEMA_IDS.map(id => `cinemaIds=${id}`).join("&");

    
    const nextTwoWeekArray = new Array(14).fill(true).map((val,i) => moment().add(i, 'd').format('YYYY-MM-DD'));
    
    const eventJsonArray = await Promise.all(nextTwoWeekArray.map(dateStr => {
        const eventUrl = `https://www.eventcinemas.com.au/Cinemas/GetSessions?${eventIdString}&date=${dateStr}`;
        return fetch(eventUrl).then(res => res.json());
    }));

    return eventJsonArray;
}

const parsePalaceHTML = async (rawHTML) => {
    const mainEl = parse(rawHTML).querySelectorAll("main");
    const containerEl = parse(mainEl).querySelectorAll(".container");
    const sessionRowContainerEl = parse(containerEl).querySelectorAll(".row")[1];
    const sessionRowEls = parse(sessionRowContainerEl).querySelectorAll(".col-md-12");

    let allSessions = [];

    for (sessionRowEl of sessionRowEls){
        const movieRoot = parse(sessionRowEl)
        const movieTitleEl = movieRoot.querySelector("a");
        const movieTitle = movieTitleEl.text;
        const poster_url = "https://palacenova.com.au/media/movie-posters/" + movieTitleEl.getAttribute("href").split("/").pop() + ".jpg";

        const [eastEndSessionEls, prospectSessionsEls] = movieRoot.querySelectorAll(".col-md-6");

        const eastEndSessions = getSessionTimesFromPlaceElArray(eastEndSessionEls);
        const eastEndSessionsWithNames = eastEndSessions.map(session => {return {...session, location: "Palace Nova Eastend"}});
        
        const prospectSessions = getSessionTimesFromPlaceElArray(prospectSessionsEls);
        const prospectSessionsWithNames = prospectSessions.map(session => {return {...session, location: "Palace Nova Prospect"}});

        
        let allSessionsForMovie = [...prospectSessionsWithNames, ...eastEndSessionsWithNames];
        
        try{
            const {imdb_id} = await getOmdbInfo(movieTitle);
            allSessionsForMovie = allSessionsForMovie.map(session => {return {...session, imdb_id}});
        }catch{
            
        }
        allSessionsForMovie = allSessionsForMovie.map(session => {return {...session, title: movieTitle, poster_url}});

        allSessions = [...allSessions, ...allSessionsForMovie];

    };

    return allSessions;
}

const parseHoytsJson = async (json) => {

    const nowShowingContent = json.viewModel[1].contentTabs.tabs.find(tab => tab.slug === "now-showing");
    const moviesShowing = nowShowingContent.contents[0].filterGrid.tiles;

    let movieSessionObjectArray = [];

    for(movie of moviesShowing){

        let sessionArray = [];
        if(!movie.sessions) continue;
        for(session of movie.sessions){
            
            const booking_url = `https://www.hoyts.com.au/movies/purchase?cinemaId=${session.cinemaId}&sessionId=${session.sessionId}`;
            
            const tags = session.sessionAttributeIds.split(";").filter(att => {
                return (
                    att === 'XTREME'
                )
            })

            const sessionObj = {
                time: moment(session.startTime),
                title: movie.title,
                location: HOYTS_ID_MAP[session.cinemaId],
                booking_url: booking_url,
                poster_url: movie.imagePoster,
                tags: tags
                
            }
            sessionArray.push(sessionObj);
        }

        try{
            const {imdb_id} = await getOmdbInfo(movie.title);
            sessionArray = sessionArray.map(session => {return {...session, imdb_id}});
        }catch{
            
        }

        movieSessionObjectArray = [...movieSessionObjectArray, ...sessionArray]

    }

    return movieSessionObjectArray

}

const parseEventJson = async (jsonArray) => {
    const movies = jsonArray.map(day => day.Data.Movies).flat();

    let allSessionTimes = [];
    for(movie of movies){
        let sessionTimesOfMovie = [];
        for(cinema of movie.CinemaModels){
            let sessionTimesForCinema = [];
            for(session of cinema.Sessions){
                const booking_url = `https://www.eventcinemas.com.au/Orders/Tickets#sessionId=${session.Id}`;
                const poster_url = movie.LargePosterUrl;

                const tags = [];
                if(
                    session.ScreenType === "Vmax" ||
                    session.ScreenType === "GC"

                ) tags.push(session.ScreenType);

                if(session.Is3d) tags.push("3D");

                const movieObject = {
                    title: movie.Name,
                    time: moment(session.StartTime),
                    booking_url: booking_url,
                    location: "Event " + cinema.Name,
                    tags: tags,
                    poster_url
                }
                sessionTimesForCinema.push(movieObject);
            }

            sessionTimesOfMovie = [...sessionTimesOfMovie, ...sessionTimesForCinema];

        }

        try{
            const {imdb_id} = await getOmdbInfo(movie.Name);
            sessionTimesOfMovie = sessionTimesOfMovie.map(session => {return {...session, imdb_id}});
        }catch{
            
        }

        allSessionTimes = [...allSessionTimes, ...sessionTimesOfMovie];
    }
    return allSessionTimes;
}

const parseWallisHTML = async (htmlArray) => {
    let allSessions = [];

    for(cinemaRawHTML of htmlArray){
        const root = parse(cinemaRawHTML);

        const cinemaName = root.querySelector(".venue-left").text.split(" ").slice(0, -1).join(" ");

        const nowShowingEl = root.querySelector("#block-wallis-tweaks-2");

        const movieTable = nowShowingEl.querySelector("table")

        let movieBoxes = [];

        for(childEl of movieTable.childNodes){
            if(childEl.tagName === "tr"){
                for(td of childEl.childNodes){
                    if(td.tagName === "td"){
                        movieBoxes.push(td)
                    }
                }
            }
        }

        for( const movieEl of movieBoxes){
            const title = movieEl.querySelector(".title").text.trim();

            const poster_url = movieEl.querySelector("img").getAttribute("src").replace("movie-poster-small","movie-poster-large");

            const sessionTimeTable = movieEl.querySelector("table");

            let movieSessionTimes = [];

            for(sessionRow of sessionTimeTable.childNodes){
                if(sessionRow.tagName === "tr"){
                    const [dayName, dayOfMonth, month] = sessionRow.firstChild.text.trim().split(" ");
                    const year = moment().year();
                    
                    const sessionTimeEls = sessionRow.querySelectorAll("a");
                    
                    for(sessionTimeEl of sessionTimeEls){
                        const time = sessionTimeEl.text.trim()
                        
                        const sessionTimeStr = `${year} ${month} ${dayOfMonth} ${time}`
                        
                        const sessionTime = moment(sessionTimeStr, 'YYYY MMM D h:mm a');

                        //If the session date is before the date of 1 month ago we could be in late December looking at session times in Jan, therefore add 1 year to the session date.
                        if(sessionTime.isBefore(moment().subtract(1, 'M'))) sessionTime.add(1, 'y');

                        const movieObj = {
                            title: title,
                            time: sessionTime,
                            booking_url: sessionTimeEl.getAttribute('href'),
                            location: cinemaName,
                            poster_url
                        }
                        movieSessionTimes.push(movieObj);
                    }

                }
            }

            try{
                const {imdb_id} = await getOmdbInfo(title);
                movieSessionTimes = movieSessionTimes.map(session => {return {...session, imdb_id}});
            }catch{
                
            }
            allSessions = [...allSessions, ...movieSessionTimes];
        }
    }
    return allSessions;
}

const saveSessionTimesToDb = (sessionTimesArray) => {
    const bulkOperationArray = sessionTimesArray.map(session => createDbOperation(session));

    const res = processBulkDbOperationArray(bulkOperationArray);
}

const processBulkDbOperationArray = (bulkOperationArray) => {

    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("loading into database");
            Session.bulkWrite(bulkOperationArray).then(res => {
                mongoose.disconnect();
                console.log("Insertions successful.")
                resolve(res)
            }).catch(err => {
                mongoose.disconnect();
                reject(err)
            });
        })
    })

}

const createDbOperation = (session) => {
    return {
        'updateOne': {
            'filter': {
                'booking_url': session.booking_url
            },
            'update': session,
            'upsert': true
        }
    }
}

const getOmdbInfo = async (titleString) => {
    const queryString = new URLSearchParams()
    queryString.append("t", titleString);
    queryString.append("apikey", OMDB_API_KEY);

    const response = await fetch(`http://www.omdbapi.com/?${queryString}`).then(res => res.json());

    if(response.Error) throw logger.error(response.Error);
    if(!response.imdbID || !response.Poster) throw "=(";
    
    logger.file(`Title: ${titleString}, imdbID: ${response.imdbID}`)
    return {imdb_id: response.imdbID, poster_url: response.Poster};
}

const getImdbInfo = async (titleString) => {
    const preparedQueryString = titleString.replace(/[^a-z0-9 ]/gi, "")
}

const getSessionTimesFromPlaceElArray = (palaceElsArray) => {
    const root = parse(palaceElsArray);
    const rootChild = root.childNodes[0];

    const dayOrSessionEls = rootChild.childNodes.filter(el => el.tagName);

    const sessionArray = [];
    let currentDay = moment()
    for(element of dayOrSessionEls){
        if(element.tagName === "div"){
            const dayNum = moment().day(element.text.trim().slice(0,-1)).day();
            if(dayNum < currentDay.day()){
                currentDay.day(7 + dayNum);
            } else {
                currentDay.day(dayNum);
            }
        } else if(element.tagName === "a"){
            const [hour, minute] = element.text.split(":");
            let tags = [];

            if(element.hasAttribute("title")){
                tags.push(element.getAttribute("title"));
            }

            const sessionTime = currentDay.clone().hour(hour).minute(minute).second(0).millisecond(0);
            sessionArray.push({
                booking_url: element.getAttribute("href"),
                time: sessionTime,
                tags: tags
            })
        }
        
    }
    return sessionArray;
}

(() => {
    getPalaceTimesAndSave();
    getHoytsTimesAndSave();
    getEventTimesAndSave();
    getWallisTimesAndSave();
})();