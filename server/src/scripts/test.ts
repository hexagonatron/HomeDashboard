import "reflect-metadata";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import BeautifulDom from 'beautiful-dom';
import { Session } from '../entities/Session';
import moment from 'moment';
import jsdom from 'jsdom';
import 'css.escape';
import { createConnection, getMongoManager } from "typeorm";

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
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path.join(__dirname, fileName), data, (err) => {
            if (err) return reject(err);
            return resolve()
        });
    })
}

const errorsToWrite: string[] = [];

const parseCookie = (cookieStr: string) => {
    const XSRF_TOKEN_REGEX = /(XSRF-TOKEN=[a-zA-z0-9\%]+?);/gm;
    const PALACE_SESSION_REGEX = /(palacenova_session=[a-zA-z0-9\%]+?);/gm;
    const xsrfTokenCookie = XSRF_TOKEN_REGEX.exec(cookieStr);
    const palaceSessionCookie = PALACE_SESSION_REGEX.exec(cookieStr);
    if (!xsrfTokenCookie || !palaceSessionCookie) {
        throw "Couldn't get xsrf or palace_session cookies";
    }
    return xsrfTokenCookie[1] + "; " + palaceSessionCookie[1];
}

const extractPalaceSessions = (dom: Document) => {
    const sessionsRaw = Array.from(dom.getElementsByTagName("script")).filter(tag => tag.getAttribute("type") === "application/ld+json").map(object => {
        try {
            const session = JSON.parse(object.textContent.replace(/,\s+}/gm, "}")) as PalaceSessionJson;
            session.url = session.url.replace("&amp;", "&");
            session.url = session.url[0].toLowerCase() + session.url.slice(1);
            return session;
        } catch (err) {
            errorsToWrite.push(object.textContent);
            return null;
        }

    });

    const sessionEntities = sessionsRaw.filter(session => session).map(session => {
        const sessionEnt = new Session();
        sessionEnt.title = session.name;
        sessionEnt.booking_url = session.url;
        sessionEnt.poster_url = session.image;
        sessionEnt.location = session.location.name === "Palace Nova Cinemas Adelaide - " ? "Palace Nova Eastend" : "Palace Nova Prospect";
        sessionEnt.time = moment(session.startDate);

        const selectorUrl = CSS.escape(session.url.slice(6));
        const sessionEl = dom.querySelector(`a[href$="${selectorUrl}"]`);
        if (sessionEl) {
            const tag = sessionEl.getAttribute("title");
            if (tag) {
                sessionEnt.tags = [tag];
                console.log(tag);
            };
        }

        return sessionEnt;
    });

    return sessionEntities;
}

const getSessionsFromPalaceUrl = async (url: string) => {

    let receivedCookie: string;
    const eastendHtml = await fetch(url).then(res => {
        receivedCookie = parseCookie(res.headers.get('set-cookie'));
        return res.text();
    });

    const eastendDom = new jsdom.JSDOM(eastendHtml).window.document;
    const token = eastendDom.getElementsByName("_token")[0].getAttribute("value");

    const prospectHtml = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ location: "prospect", "_token": token }),
        headers: {
            'content-type': 'application/json',
            Cookie: receivedCookie
        }
    }).then(res => res.text());

    const prospectDom = new jsdom.JSDOM(prospectHtml).window.document;

    const entities = [...extractPalaceSessions(eastendDom), ...extractPalaceSessions(prospectDom)];

    while (errorsToWrite.length) {
        await writeFile(`error${errorsToWrite.length}.txt`, errorsToWrite.pop());
    }

    return entities;
}


(async () => {
    const text = await fetch("https://palacenova.com.au/").then(res => res.text());

    const dropdownItems = Array.from(new jsdom.JSDOM(text).window.document.getElementsByClassName("dropdown-item"));
    const urls = dropdownItems.map(dropdownItem => dropdownItem.getAttribute("href"))
        .filter((url: null | string): url is string => url ? url.includes("https://palacenova.com.au/films/") : false);

    // const entities = (await Promise.all(urls.map(url => getSessionsFromPalaceUrl(url)))).flat();

    const entities = await getSessionsFromPalaceUrl(urls[0]);

    const connection = await createConnection();

    console.log("Connected!");

    const em = getMongoManager();
    console.log(entities[0]);
    await Promise.all(entities
        .map(async e => {

            const { updatedAt, createdAt, ...newE } = e

            return em.findOneAndUpdate(
                Session,
                { booking_url: e.booking_url },
                {
                    $set: {
                        ...newE,
                        updatedAt: moment()
                    },
                    $setOnInsert: {
                        createdAt: moment()
                    }
                },
                { upsert: true }
            )
        })
    );

    await connection.close();

    writeFile("out.txt", text);
})()
