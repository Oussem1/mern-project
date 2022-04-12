const verify = require('./verifyToken');
const User = require('../models/Users');
const router = require('express').Router();
const Joi = require('@hapi/joi')
const { registerValidation } = require('../validation')
const bcrypt = require('bcryptjs')




// GET ALL USERS

router.get('/users',verify, async (req, res) => {
    const users = await User.find().select('-password');
    res.send(users);
})

// POST USERS
router.post('/register', async (req, res) => {
    

    const error = registerValidation(req.body)
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
        password: hashedPwd,
        isAdmin: req.body.isAdmin
    });
    try {
        await user.save();
        res.send({
            email: email,
            pseudo: pseudo
        });
        
    } catch (err) {
        res.status(400).send(error)
    }
});

// GET USER BY ID 

router.get('/users/:id',verify,async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

// UPDATE USER

router.patch('/users/:id',verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        Object.assign(user, req.body)
        user.save();
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

// DELETE USER

router.delete('/users/:id',verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.send(`${user.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

module.exports = router;