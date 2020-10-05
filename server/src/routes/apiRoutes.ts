import { Router } from 'express';
import moment from 'moment';
import express, {} from 'express'
import { validateAndParseQueryDate } from '../helpers/dateHelpers';
import { findSessions } from '../controllers/sessionControllers';
import { formatSessions } from '../helpers/sessionHelpers';
import { ISession } from '../models/Session';

const router = Router();

router.get('/sessions', async (req, res) => {
    try{
        const fromDate = req.query.from? validateAndParseQueryDate(req.query.from): moment().subtract(1, "h");
        const toDate = req.query.to? validateAndParseQueryDate(req.query.to): moment().add(7, "d");

        const sessions = await findSessions(fromDate, toDate);
        const sessionJson = formatSessions(sessions);
        
        res.status(200).json(sessionJson);

    } catch (err){
        console.log(err);
        res.json({error: err});
    }
});

router.get('/another', (req, res) => {
    res.json({hi:"again"});
});

export default router;