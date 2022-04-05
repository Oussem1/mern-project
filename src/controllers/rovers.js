const Rover = require('../models/Rovers');

exports.findRovers = async (req, res) => {
    const rovers = await Rover.find();
    res.send(rovers);
}

exports.createRovers = async (req, res) => {
    const rover = new Rover(req.body);
    await rover.save();
    res.send(rover);
}

exports.findRover = async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        res.send(rover);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }
}

exports.updateRover = async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        Object.assign(rover, req.body)
        rover.save();
        res.send(rover);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }

}

exports.deleteRover = async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        await rover.remove();
        res.send(`${rover.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }
}