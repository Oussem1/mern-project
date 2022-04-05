const User = require('../models/Users');

exports.findUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
}

exports.createUsers = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
}

exports.findUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        Object.assign(user, req.body)
        user.save();
        res.send(user);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }

}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.send(`${user.pseudo} has been deleted`);
    } catch {
        res.status(404).send({ error: 'User doesn\'t exist!' });
    }
}