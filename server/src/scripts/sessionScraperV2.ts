import BeautifulDom from "beautiful-dom";
import Logger from "../helpers/Logger";
import fetch from 'node-fetch';

const logger = new Logger();


const getPalaceTimesAndSave = async () => {

    const palaceHTMLraw = await getPalaceMovieTimes();

    await parsePalaceHTML(palaceHTMLraw);

    // saveSessionTimesToDb(movieTimes);
}

const getPalaceMovieTimes = async () => {
    logger.info("Getting Palace HTML");
    const response = await fetch('https://palacenova.com.au/showing-this-week').then(res => res.text());
    return response;
}

const parsePalaceHTML = async (rawHTML: string) => {
    const dom = new BeautifulDom(rawHTML);
    // const sessionRows = dom.querySelectorAll("main .container .row .col-md-12");
    logger.info("Parsing HTML")
    const sessionRowContainer = dom.querySelectorAll("main>.container>.row");
    const sessionRows = sessionRowContainer[1].getElementsByClassName("col-md-12");
    logger.info(`Found ${sessionRows.length} titles at Palace`);

    for (const sessionRow of sessionRows) {
        const movieTitle = sessionRow.querySelector("a")?.innerText;
        console.log(movieTitle);
        
    }
}

(() => {
    getPalaceTimesAndSave();
    // getHoytsTimesAndSave();
    // getEventTimesAndSave();
    // getWallisTimesAndSave();
})();