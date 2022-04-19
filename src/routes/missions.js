const express = require('express');
const router = express.Router();
const Mission = require('../models/Missions');
const Joi = require('@hapi/joi');
const verify = require('./verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *   Mission:
 *    type: object
 *    properties:
 *     mission_name:
 *      type: string
 *      description: name of the mission
 *     country:
 *      type: string
 *      description: country of mission has started
 *     start_date:
 *      type: string
 *      description: start mission date
 *     end_date:
 *      type: string
 *      description: end mission date
 *     rovers:
 *      type: array
 *      items:
 *        type: string
 *      description: rovers used
 *    required:
 *     - mission_name
 *     - country
 *     - start_date
 *     - end_date
 *     - rovers
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   MissionPatch:
 *    type: object
 *    properties:
 *     mission_name:
 *      type: string
 *      description: name of the mission
 *     country:
 *      type: string
 *      description: country of mission has started
 *     start_date:
 *      type: string
 *      description: start mission date
 *     end_date:
 *      type: string
 *      description: end mission date
 *     rovers:
 *      type: array
 *      description: rovers used
 */

/**
 * @swagger
 * /mission/new-mission:
 *   post:
 *    summary: Create Mission
 *    tags: [Mission]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/Mission'
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
 router.post('/mission/new-mission', verify, async (req, res) => {
  const user = req.user
  const mission = new Mission({
    ...req.body,
    userId: user.
      id,
  });

  const schema = Joi.object().keys({
    mission_name: Joi.string().required(),
    country: Joi.string().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    rovers: Joi.array().required()
  })

  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    try {
      const matchingRover = await Mission.find({ 'rovers': { $in: req.body.roverId } });
      const isDefined = matchingRover[0]
      if (isDefined === undefined) {
        try {
          const savedMission = await mission.save();
          res.send(savedMission);
        } catch (error) {
          res.status(400).send({ message: error });
        }
      } else {
        res.status(400).send("Rover is already used")
      }
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }
});

/**
 * @swagger
 * /missions:
 *   get:
 *    summary: Get all missions
 *    tags: [Mission]
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find().select(['-__v', '-userId']);
    res.send(missions);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

/**
 * @swagger
 * /mission/{id}:
 *   get:
 *    summary: Get mission by id
 *    tags: [Mission]
 *    parameters:
 *    - name: id
 *      description: id
 *      in: path
 *      type: integer
 *    responses:
 *      200:
 *       description: Success
 *      400:
 *       description: Bad Request    
 */
router.get('/mission/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).select(['-__v', '-userId']);
    res.send(mission);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

/**
 * @swagger
 * /mission/{id}:
 *   patch:
 *    summary: Modify mission by id
 *    tags: [Mission]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/MissionPatch'
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
 router.patch('/mission/:id', verify, async (req, res) => {
  const schema = Joi.object().keys({
    mission_name: Joi.string(),
    country: Joi.string(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    rovers: Joi.array()
  })
  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    try {
      const user = req.user
      const mission = await Mission.findById(req.params.id)
      if (user.isAdmin || user.id == mission.userId) {
        try {
          Object.assign(mission, req.body)
          mission.save();
          res.send(mission);
        } catch (error) {
          res.status(400).send({ message: error });
        }
      } else {
        res.status(400).send("Access Denied")
      }
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }
})

/**
 * @swagger
 * /mission/{id}:
 *   delete:
 *    summary: Delete mission by id
 *    tags: [Mission]
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
router.delete('/mission/:id', verify, async (req, res) => {
  try {
    const removedMission = await Mission.findOneAndDelete({ _id: req.params.id });
    const userJWT = req.user
    if (removedMission) {
      if (userJWT.isAdmin || userJWT._id == removedMission.userId) {
        res.send(removedMission);
      } else {
        res.status(400).send("Access Denied")
      }
    } else {
      res.status(400).send("Mission doesn\'t exist")
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = router;