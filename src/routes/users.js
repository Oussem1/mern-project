const verify = require('./verifyToken');
const User = require('../models/Users');
const router = require('express').Router();
const Joi = require('@hapi/joi')
const { registerValidation } = require('../validation')
const bcrypt = require('bcryptjs')

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      description: the user email
 *     pseudo:
 *      type: string
 *      description: the pseudo of the user
 *     password:
 *      type: string
 *      description: the password of the user
 *     isAdmin:
 *      type: boolean
 *      description: user admin
 *    required:
 *     - email
 *     - pseudo
 *     - password
 *     - isAdmin
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   UserPatch:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      description: the user email
 *     pseudo:
 *      type: string
 *      description: the pseudo of the user
 *     password:
 *      type: string
 *      description: the password of the user
 *     isAdmin:
 *      type: boolean
 *      description: user admin
 */

/**
 * @swagger
 * /register:
 *   post:
 *    summary: Register new User
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *       description: Token
 *      400:
 *       description: Bad Request    
 */
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
            email: req.body.email,
            pseudo: req.body.pseudo
        });
        
    } catch (err) {
        res.status(400).send(error)
    }
});
/**
 * @swagger
 * /users:
 *   get:
 *    summary: Get all users
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.get('/users',verify, async (req, res) => {
    const users = await User.find().select(['-password', '-__v']);
    res.send(users);
})

/**
 * @swagger
 * /user/{id}:
 *   get:
 *    summary: Get user by id
 *    tags: [User]
 *    parameters:
 *    - name: id
 *      description: id
 *      in: path
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.get('/user/:id',verify,async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(['-__v']);
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *    summary: Modify user by id
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/UserPatch'
 *    parameters:
 *    - name: id
 *      description: id
 *      in: path
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.patch('/user/:id',verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        Object.assign(user, req.body)
        user.save();
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *    summary: Delete user by id
 *    tags: [User]
 *    parameters:
 *    - name: id
 *      description: id
 *      in: path
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
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