import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import BeautifulDom from 'beautiful-dom';
import { Session } from '../entities/Session';
import moment from 'moment';
import jsdom from 'jsdom';

interface PalaceSessionJson {
        '@context': string
        '@type': string
        name: string
        description: string
        url: string
        image: string
        startDate: string
        location: {
          '@type': string
          name: 'Palace Nova Cinemas Adelaide - Prospect' | 'Palace Nova Cinemas Adelaide - '
          image: string
          address: string
          telephone: string
        },
        workPresented: {
          '@type': string
          name: string
          duration: string
          genre: string
          thumbnailUrl: string
          image: string
          contentRating: string
          director: {
                '@type': string
                name: string
          },
          actor: {
              '@type': string
              name: string
            }[]
        }
}

const writeFile = (fileName: string, data: string) => {
    fs.writeFile(path.join(__dirname, fileName), data, (err) => {
        if(err) return console.log(err);
        console.log("done");
    });
}

const parseCookie = (cookie: string) => {
    console.log(cookie);
    const regex = /(XSRF-TOKEN=[a-zA-Z0-9\%]+?);.*(palacenova_session=[a-zA-Z0-9\%]+?);/g;
    const match = regex.exec(cookie);
    
    return match[1] + ";" + match[2];
}

const extractPalaceSessions = (dom: BeautifulDom) => {
    const sessionsRaw = dom.getElementsByTagName("script")
    .filter(tag => tag.getAttribute("type") === "application/ld+json")
    .map(object => {
        const session = JSON.parse(object.textContent) as PalaceSessionJson;
        session.url = session.url.replace("&amp;", "&").toLowerCase();
        return session;
    });

    return sessionsRaw;
}

const getSessionsFromPalaceUrl = async (url: string) => {

    let cookie: string;
    const eastendHtml = await fetch(url).then(res => {
        cookie = parseCookie(res.headers.get('set-cookie'));
        return res.text();
    });

    const eastendDom = new BeautifulDom(eastendHtml);

    const token = eastendDom.getElementsByName("_token")[0].getAttribute("value");

    const prospectHtml = await fetch(url, {
        method: "POST",
        body: JSON.stringify({location: "prospect", "_token": token}),
        headers: {
            'content-type': 'application/json',
            Cookie: cookie
        }
    }).then(res => res.text());

    const prospectDom = new BeautifulDom(prospectHtml);

    const sessionsRaw = [...extractPalaceSessions(eastendDom), ...extractPalaceSessions(prospectDom)];

    const sessionEntities = sessionsRaw.map(session => {
        const sessionEnt = new Session();
        sessionEnt.booking_url = session.url;
        sessionEnt.poster_url = session.image;
        sessionEnt.location = session.location.name === "Palace Nova Cinemas Adelaide - " ? "Palace Nova Eastend" : "Palace Nova Prospect";
        sessionEnt.time = moment(session.startDate);
        sessionEnt.tags
    })

    console.log(sessionEntities);
}


(async () => {
    const text = await fetch("https://palacenova.com.au/").then(res => res.text());
    
    const dropdownItems = new BeautifulDom(text).getElementsByClassName("dropdown-item");
    const urls = dropdownItems.map(dropdownItem => dropdownItem.getAttribute("href"))
    .filter((url: null | string): url is string => url? url.includes("https://palacenova.com.au/films/"): false);
    
    getSessionsFromPalaceUrl( urls[0] );
    
    writeFile("out.txt", text);
    
    const text1 = await fetch("https://palacenova.com.au/showing-this-week").then(res => res.text());
    const dom = new jsdom.JSDOM(text1);
    
    const test = dom.window.document.querySelectorAll("main>.container>.row>.col-md-12");
    test.forEach(el => {
        console.log(el.innerHTML)
    })
    console.log(test.length)
})()
