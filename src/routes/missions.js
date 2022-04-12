const express = require('express');
const router = express.Router();
const Mission = require('../models/Missions');
const Joi = require('@hapi/joi');
const verify = require('./verifyToken');


/* GET, POST, DELETE, UPDATE missions. */

// GET ALL
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find();
    res.send(missions);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// GET by id
router.get('/mission/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.roverId);
    res.send(mission);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// POST
router.post('mission/new-mission', verify, async (req, res) => {
  const user = req.user
  const mission = new Mission({
    ...req.body,
    _id: user._id,
  });

  const schema = Joi.object().keys({
    mission_name: Joi.string().required(),
    country: Joi.string().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    rovers: Joi.array().required(),
    userId: Joi.string().required()
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

// DELETE
router.delete('mission/delete', verify, async (req, res) => {
  try {
    const removedMission = await Mission.findOneAndDelete({ _id: req.params.missionId });
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

// // PUT
router.put('mission/update', verify, async (req, res) => {
  const schema = Joi.object().keys({
    mission_name: Joi.string().required()
  })
  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    try {
      const user = req.user
      const mission = await Mission.findByIdAndUpdate(
        { _id: req.params.missionId },
        { $set: { mission_name: req.body.mission_name } }
      );
      if (user.isAdmin || user._id == mission.userId) {
        try {
          res.send(mission.mission_name);
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

module.exports = router;