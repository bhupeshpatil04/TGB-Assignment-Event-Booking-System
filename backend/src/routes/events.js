const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/rbac');

router.post('/', authenticate, permit('ADMIN','ORGANIZER'), async (req, res) => {
  const { title, description, location, startAt, endAt } = req.body;
  const event = await prisma.event.create({ data: { title, description, location, startAt: new Date(startAt), endAt: new Date(endAt), organizerId: req.user.userId }});
  res.json(event);
});

router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({ include: { tickets: true }});
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: Number(req.params.id) }, include: { tickets: true }});
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
});

module.exports = router;
