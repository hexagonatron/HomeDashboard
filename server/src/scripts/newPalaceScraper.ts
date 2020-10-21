import fetch, {Headers, RequestInit} from 'node-fetch';
import Logger from '../helpers/Logger';

const PALACE_URL = 'https://palacenova.com.au';
const TOKEN_REGEX = /"_token" value="(.*)"/;
const XSRF_COOKIE_REGEX = /XSRF-TOKEN=(.*?);/;
const PALACE_COOKIE_REGEX = /palacenova_session=(.*?);/;

const log = new Logger();

fetch(PALACE_URL, {
    method: 'GET'
}).then(res => {
    res.text().then(text => {

        if (!res.headers.has('set-cookie')) {
            throw "No Cookie sent";
        }

        const parsed = TOKEN_REGEX.exec(text);

        if (!parsed) {
            throw "No token found";
        }

        const cookie = res.headers.get('set-cookie');
        if (!cookie) {
            throw "Couldn't parse cookie";
        }
        const xsrfCookieParsed = XSRF_COOKIE_REGEX.exec(cookie);
        const palaceCookieParsed = PALACE_COOKIE_REGEX.exec(cookie);

        if(!(xsrfCookieParsed && palaceCookieParsed)){
            throw "Couldn't find xsrf or palace cookie";
        }

        const xsrfCookie = xsrfCookieParsed[1];
        const palaceCookie = palaceCookieParsed[1];

        const token = parsed[1];

        log.info(`XSRF cookie: ${xsrfCookie}`);
        log.info(`Palace cookie: ${palaceCookie}`);
        log.info(`Found token: ${token}`);

        getPalaceTimes(token, xsrfCookie, palaceCookie);

    });
});

const getPalaceTimes = (token: string, xsrfCookie: string, palaceCookie: string) => {
    const body = new URLSearchParams();
    const headers = new Headers();

    headers.append('Cookie', `XSRF-TOKEN=${xsrfCookie};palacenova_session=${palaceCookie}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    body.append("_token", token);
    body.append("location", "eastend");
    body.append("day", "2020-10-22");
    body.append("type", "now_showing");

    console.log(headers)

    fetch(PALACE_URL, {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    }).then(res => res.json()).then(json => {
        console.log(json);
    }).catch(err => {
        log.error(err);
    });

}