const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(400).send('Access Denied')
  
  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(400);
    }
    req.user = user;
    return next();
  })
}