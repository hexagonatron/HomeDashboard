import {Moment} from 'moment';

export const apiGet = (url: string, headers?: Headers) => {
    return fetch(url, {
        method: "GET",
        headers: headers
    })
    .then(res => res.json())
    .then(json => {
        if(json.error) throw json.error
        return json
    })
    .catch(err => console.log(err));
}

export const getSessionsByDate = (fromDate?: Moment, toDate?: Moment) => {
    const queryString = new URLSearchParams()
    if(fromDate) queryString.append('from', fromDate.format("DD-MM-YYYY"));
    if(toDate) queryString.append('to', toDate.format("DD-MM-YYYY"));

    return apiGet(`/api/sessions?` + queryString);
}