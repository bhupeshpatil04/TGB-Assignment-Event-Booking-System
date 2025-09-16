const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const REFRESH_DAYS = 7;

function signAccess(payload){ return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'}); }
function signRefresh(payload){ return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: '7d'}); }

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(400).json({ message: 'email exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name, role } });
  res.json({ id: user.id, email: user.email, role: user.role });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccess({ userId: user.id, role: user.role, email: user.email });
  const refreshToken = signRefresh({ userId: user.id });
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  await prisma.refreshToken.create({
    data:{ tokenHash, userId: user.id, expiresAt: new Date(Date.now() + REFRESH_DAYS*24*60*60*1000) }
  });

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash }});
    if (!stored || stored.revoked || stored.expiresAt < new Date()) return res.status(401).json({ message: 'Invalid or revoked' });
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true }});
    const newRefresh = signRefresh({ userId: payload.userId });
    const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');
    await prisma.refreshToken.create({ data:{ tokenHash: newHash, userId: payload.userId, expiresAt: new Date(Date.now() + REFRESH_DAYS*24*60*60*1000) }});
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    const newAccess = signAccess({ userId: user.id, role: user.role, email: user.email });
    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true }});
  }
  res.json({ message: 'Logged out' });
});

module.exports = router;
