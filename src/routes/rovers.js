const verify = require('jsonwebtoken');
const Rover = require('../models/rovers');
const router = require('express').Router();

router.get('/rovers', verify, async (req, res) => {
    const rovers = await Rover.find().select('-password');
    res.send(rovers);
}
)
// exports.findRovers = async (req, res) => {
//     const rovers = await Rover.find().select('-password');
//     res.send(rovers);
// }

router.post('/rovers', async (req, res) => {
    const rover = new Rover(req.body);
    await rover.save();
    res.send(rover);
}
)
// exports.createRovers = async (req, res) => {
//     const rover = new Rover(req.body);
//     await rover.save();
//     res.send(rover);
// }

router.get('/rovers/:id', verify, async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        res.send(rover);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }
}
)
// exports.findRover = async (req, res) => {
//     try {
//         const rover = await Rover.findById(req.params.id);
//         res.send(rover);
//     } catch {
//         res.status(404).send({ error: 'Rover doesn\'t exist!' });
//     }
// }

router.patch('/rovers/:id', verify, async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        Object.assign(rover, req.body)
        rover.save();
        res.send(rover);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }
}
)
// exports.updateRover = async (req, res) => {
//     try {
//         const rover = await Rover.findById(req.params.id);
//         Object.assign(rover, req.body)
//         rover.save();
//         res.send(rover);
//     } catch {
//         res.status(404).send({ error: 'Rover doesn\'t exist!' });
//     }

// }

router.delete('/rovers/:id', verify, async (req, res) => {
    try {
        const rover = await Rover.findById(req.params.id);
        await rover.remove();
        res.send(`${rover.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'Rover doesn\'t exist!' });
    }
}
)

module.exports = router;
// exports.deleteRover = async (req, res) => {
//     try {
//         const rover = await Rover.findById(req.params.id);
//         await rover.remove();
//         res.send(`${rover.pseudo} has been deleted`);
//     } catch {
//         res.status(404).send({ error: 'Rover doesn\'t exist!' });
//     }
// }