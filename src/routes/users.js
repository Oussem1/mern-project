const verify = require('jsonwebtoken');
const User = require('../models/Users');
const router = require('express').Router();
const Joi = require('@hapi/joi')


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - pseudo
 *         - password
 *         - isAdmin
 *       properties:
 *         email:
 *           type: string
 *           description: The auto-generated id of the user
 *         pseudo:
 *           type: string
 *           description: The user description
 *         password:
 *           type: string
 *           description: The user description
 *         isAdmin:
 *           type: boolean
 *           description: The user description
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The books managing API
  */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET ALL USERS

router.get('/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.send(users);
}
)

// POST USERS
router.post('/post', async (req, res) => {
    const user = new User({
        ...req.body,
        isAdmin: false
    });


    const userSchema = {
        email: Joi.string().required(),
        pseudo: Joi.string().required(),
        password: Joi.string().required()
    }
    const { error } = Joi.validate(req, res, userSchema)
    if (error) return res.status(400).send(error.details[0].message);
    await user.save();
    res.send(user);
});
// router.post('/users', async (req, res) => {
//     const user = new User(req.body);
//     await user.save();
//     res.send(user);
// }
// )

// GET USER BY ID 

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

// UPDATE USER

router.patch('/users/:id', async (req, res) => {
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

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.send(`${user.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

module.exports = router;