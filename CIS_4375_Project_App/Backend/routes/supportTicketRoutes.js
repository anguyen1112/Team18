'use strict';

const express = require('express');
const supportTicketCntr  = require('../controllers/supportTicketController');
const router = express.Router();
router.get('/supporttickets', supportTicketCntr.GetAllSupportTickets);
router.get('/ticketDisplay', supportTicketCntr.GetAllTicketsDisplay);
router.get('/ticketbycat', supportTicketCntr.supportTicketByCat);
router.get('/ticketbycat/:id', supportTicketCntr.supportTicketByCatPerUser);
router.get('/supportticket/:id', supportTicketCntr.getSingleTicket);
router.get('/ticketpersupport', supportTicketCntr.supportTicketPerSupport);
router.post('/supportticket', supportTicketCntr.insertSupportTicket);
router.put('/supportticket/:id', supportTicketCntr.updateSupportTicket);
router.delete('/supportticket/:id', supportTicketCntr.delSupportTicket);


module.exports = {
    routes: router
}