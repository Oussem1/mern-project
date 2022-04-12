const router = require('express').Router();
const User = require('../models/Users')
const { loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req)
    if (error) return res.status(400).send(error.details[0].message);

    // check if email exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email not found');
    //password is correct ?
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if (!validPwd) return res.status(400).send('Invalid password')

    // Create and assign a token
    const token = jwt.sign({id : user._id, isAdmin: user.isAdmin}, process.env.TOKEN, { expiresIn: process.env.TOKEN_TIME_DURATION })

    res.header('auth-token', token).send(token).send('Logged in!')
});

module.exports = router;