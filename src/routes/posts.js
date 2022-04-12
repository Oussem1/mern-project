const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify , async(req, res) => {
    const users = await User.find().select('-password');
    res.send(users);
});

module.exports = router;