const Rover = require('../models/Rovers');


// const rovers = await Rover.find()
//     .select(['-__v'])
//     .skip(offset)
//     .limit(limit)
//     .sort([[sortBy, sortQuery]])

// exports.findRovers = async (req, res) => {
//     const rovers = await Rover.find();
//     res.send(rovers);
// }

exports.createRovers = async (req, res) => {
    const offset = parseInt(req.query.offset) || 1;
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
    // const rovers = new Rover(req.body);
    const rovers = await Rover.find()
        .skip(offset)
        .limit(limit)
        .sort([[sortBy, sortQuery]])
    await rovers.save();
    res.send(rovers);
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