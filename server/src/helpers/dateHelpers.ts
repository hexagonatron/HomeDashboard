import moment from 'moment';
import express from 'express';
import { ParsedQs } from 'qs'
import { invalidDateFormat } from '../constants/errors';

export const validateAndParseQueryDate = (dateQueryParam: string | ParsedQs | string[] | ParsedQs[]) => {
    if (typeof dateQueryParam !== "string") throw invalidDateFormat;
    return momentObjectFromDateString(dateQueryParam);
}

export const momentObjectFromDateString = (dateString: string) => {
    const date = moment(dateString, "DD-MM-YYYY");
    if(!date.isValid()) throw invalidDateFormat;
    return date
}