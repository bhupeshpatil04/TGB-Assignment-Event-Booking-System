module.exports.permit = (...allowed) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  if (allowed.includes(user.role)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};
