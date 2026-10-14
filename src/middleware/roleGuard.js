export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403);
      throw new Error('Permission denied');
    }
    next();
  };
};
