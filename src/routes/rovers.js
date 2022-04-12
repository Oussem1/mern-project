const express = require('express');
const router = express.Router();
const Rover = require('../models/Rovers');
const Joi = require('@hapi/joi');
const verify = require('./verifyToken');

/* GET, POST, DELETE, UPDATE rovers. */

// GET ALL
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
    } else if (req.query.sortBy === "rover_name") {
      sortBy = "rover_name";
    }

    const rovers = await Rover.find()
      .select(['-__v'])
      .skip(offset)
      .limit(limit)
      .sort([[sortBy, sortQuery]])
    if (rovers[0] === undefined) {
      res.sendStatus(204)
    } else {
      res.send(rovers);
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// GET by id
router.get('rover/:id', async (req, res) => {
  try {
    const rover = await Rover.findById(req.params.roverId);
    res.send(rover);
  } catch (error) {
    res.status(400).send({ message: error });
  }
})

// POST
router.post('/rover/new-rover', verify, async (req, res) => {
  const dateUnix = Math.floor(new Date(req.body.launch_date).getTime() / 1000)
  const user = req.user
  const rover = new Rover({
    name: req.body.name.toLowerCase(),
    launch_date: dateUnix,
    construction_date: req.body.construction_date,
    image: req.body.image,
    userId: user._id,
  });

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    launch_date: Joi.string().required(),
    construction_date: Joi.string().required(),
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

// DELETE
router.delete('/rover/delete', verify, async (req, res) => {
  const user = req.user
  if (user.isAdmin) {
    try {
      const removedRover = await Rover.deleteOne({ _id: req.params.roverId });
      res.send(removedRover);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  } else {
    res.status(401).send("Access Denied")
  }
});

// PUT
router.put('rover/update', verify, async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    launch_date: Joi.string().required(),
    construction_date: Joi.string().required(),
    constructor_rover: Joi.string().required(),
    image: Joi.string().required()
  })

  if (schema.validate(req.body).error) {
    res.status(400).send(schema.validate(req.body).error.details);
  } else {
    const user = req.user
    if (user.isAdmin) {
      try {
        const rover = await Rover.updateOne(
          { _id: req.params.roverId },
          { $set: { name: req.body.name } },
          { $set: { launch_date: req.body.launch_date } },
          { $set: { construction_date: req.body.construction_date } },
          { $set: { constructor_rover: req.body.constructor_rover } },
          { $set: { image: req.body.image } }
        );
        res.send(rover);
      } catch (error) {
        res.status(400).send({ message: error });
      }
    } else {
      res.status(401).send("Acces denied")
    }

  }
})


module.exports = router;
