const Mission = require('../models/Missions');

exports.findMissions = async (req, res) => {
    const missions = await Mission.find();
    res.send(missions);
}

exports.createMissions = async (req, res) => {
    const mission = new Mission(req.body);
    await mission.save();
    res.send(mission);
}

exports.findMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        res.send(mission);
    } catch {
        res.status(404).send({ error: 'Mission doesn\'t exist!' });
    }
}

exports.updateMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        Object.assign(mission, req.body)
        mission.save();
        res.send(mission);
    } catch {
        res.status(404).send({ error: 'Mission doesn\'t exist!' });
    }

}

exports.deleteMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        await mission.remove();
        res.send(`${mission.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'Mission doesn\'t exist!' });
    }
}