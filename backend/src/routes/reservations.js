const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/rbac');

router.post('/', authenticate, permit('CUSTOMER'), async (req, res) => {
  const { ticketRequests } = req.body; // [{ ticketId, quantity }]
  const userId = req.user.userId;
  const reservation = await prisma.$transaction(async (tx) => {
    const resv = await tx.reservation.create({ data: { userId }});
    for (const tr of ticketRequests) {
      const ticket = await tx.ticket.findUnique({ where: { id: tr.ticketId }});
      if (!ticket || ticket.quantity < tr.quantity) throw new Error('Insufficient tickets');
      await tx.ticket.update({ where: { id: tr.id }, data: { quantity: ticket.quantity - tr.quantity }});
      await tx.reservationTicket.create({ data: { reservationId: resv.id, ticketId: tr.ticketId, quantity: tr.quantity }});
    }
    return resv;
  });
  res.json(reservation);
});

router.get('/', authenticate, async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.userId };
  const reservations = await prisma.reservation.findMany({ where, include:{ tickets:true, payment:true }});
  res.json(reservations);
});

module.exports = router;
