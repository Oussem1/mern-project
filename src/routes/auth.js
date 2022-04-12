const router = require('express').Router();
const User = require('../models/Users')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req)
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already on db
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exist');


    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hashedPwd
    });
    try {
        await user.save();
        res.send({
            email: email,
            pseudo 
        });
    } catch (err) {
        res.status(400).send(err)
    }
    // await user.save();
});

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
    const token = jwt.sign({id : user._id, isAdmin: user.isAdmin}, prosses.env.TOKEN)
    res.header('auth-token', token).send(token)

    res.send('Logged in!')
});

module.exports = router;