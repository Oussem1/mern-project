const express = require('express');
const router = express.Router();
const Rover = require('../models/Rovers');
const Joi = require('@hapi/joi');
const verify = require('./verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *   Rover:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: rover's name
 *     launch_date:
 *      type: string
 *      description: the lanch date of the rover
 *     construction_date:
 *      type: string
 *      description: date of when the rover has been build
 *     constructor_rover:
 *      type: string
 *      description: name of the construction of this rover
 *     image:
 *      type: string
 *      description: image in url format
 *    required:
 *     - name
 *     - launch_date
 *     - construction_date
 *     - constructor_rover
 *     - image
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   RoverPatch:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: rover's name
 *     launch_date:
 *      type: string
 *      description: the lanch date of the
 *     construction_date:
 *      type: string
 *      description: date of when the rover has been build
 *     constructor_rover:
 *      type: string
 *      description: name of the construction of this rover
 *     image:
 *      type: string
 *      description: image in url format
 */

/**
 * @swagger
 * /rover/new-rover:
 *   post:
 *    summary: Create new rover
 *    tags: [Rover]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/Rover'
 *    responses:
 *      200:
 *       description: Succes
 *      400:
 *       description: Bad Request    
 */
router.post('/rover/new-rover', verify, async (req, res) => {
  const dateUnix = Math.floor(new Date(req.body.launch_date).getTime() / 1000)
  const user = req.user
  const rover = new Rover({
    name: req.body.name.toLowerCase(),
    launch_date: dateUnix,
    construction_date: req.body.construction_date,
    constructor_rover: req.body.constructor_rover,
    image: req.body.image,
    userId: user.id,
  });

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    launch_date: Joi.string().required(),
    construction_date: Joi.string().required(),
    constructor_rover: Joi.string().required(),
    image: Joi.string().required(),
  })

  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    try {
      const savedRover = await rover.save();
      res.send(savedRover);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }
});

/**
 * @swagger
 * /rovers:
 *   get:
 *    summary: Get all rovers
 *    tags: [Rover]
 *    parameters:
 *    - name: offset
 *      description: offset of the paginantion
 *      in: query
 *      type: integer
 *    - name: limit
 *      description: get limit of all rovers
 *      in: query
 *      type: integer
 *    - name: sort
 *      description: desc or asc
 *      in: query
 *      type: string
 *    - name: sortBy
 *      description: which parameters want to be sorted by (name or launch_date)
 *      in: query
 *      type: string
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.get('/rovers', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 0;

    var sortQuery = 1;
    var sortBy = "launch_date";

    if (req.query.sort === 'desc') {
      sortQuery = -1;
    } else if (req.query.sort === 'asc') {
      sortQuery = 1;
    }
    if (req.query.sortBy === 'launch_date') {
      sortBy = "launch_date";
    } else if (req.query.sortBy === "name") {
      sortBy = "name";
    }

    const rovers = await Rover.find()
      .select(['-__v', '-userId'])
      .skip(offset)
      .limit(limit)
      .sort([[sortBy, sortQuery]])
    if (rovers[0] === undefined) {
      res.sendStatus(200)
    } else {
      res.send(rovers);
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

/**
 * @swagger
 * /rover/{id}:
 *   get:
 *    summary: Get rover by id
 *    tags: [Rover]
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
router.get('/rover/:id', async (req, res) => {
  try {
    const rover = await Rover.findById(req.params.id).select(['-__v', '-userId']);
    res.send(rover);
  } catch (error) {
    res.status(400).send({ message: error });
  }
})

/**
 * @swagger
 * /rover/{id}:
 *   patch:
 *    summary: Modify rover by id
 *    tags: [Rover]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/RoverPatch'
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
router.patch('/rover/:id', verify, async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    launch_date: Joi.string(),
    construction_date: Joi.string(),
    constructor_rover: Joi.string(),
    image: Joi.string()
  })

  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    const user = req.user
    if (user.isAdmin) {
      try {
        const rover = await Rover.findById(req.params.id)
        Object.assign(rover, req.body)
        rover.save();
        res.send(rover);
      } catch (error) {
        res.status(400).send({ message: error });
      }
    } else {
      res.status(400).send("Acces denied")
    }

  }
})

/**
 * @swagger
 * /rover/{id}:
 *   delete:
 *    summary: Delete rover by id
 *    tags: [Rover]
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
router.delete('/rover/:id', verify, async (req, res) => {
  const user = req.user
  if (user.isAdmin) {
    try {
      const removedRover = await Rover.deleteOne({ _id: req.params.id });
      res.send(removedRover);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  } else {
    res.status(400).send("Access Denied")
  }
});

module.exports = router;
