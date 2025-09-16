const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/rbac');

router.post('/', authenticate, permit('ADMIN','ORGANIZER'), async (req, res) => {
  const { eventId, type, price, quantity } = req.body;
  const ticket = await prisma.ticket.create({ data: { eventId, type, price: Number(price), quantity: Number(quantity) }});
  res.json(ticket);
});

router.get('/:id', async (req, res) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: Number(req.params.id) }});
  if (!ticket) return res.status(404).json({ message: 'Not found' });
  res.json(ticket);
});

module.exports = router;
