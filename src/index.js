const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/users')
const roverController = require('./controllers/rovers')
const missionController = require('./controllers/missions')

const username = 'oaloui';
const password = 'cifkPeGzdJNvJ3ly';
const cluster = 'cluster0.g1unz';
const dbname = 'myFirstDatabase';


const app = express();


mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
).then(() => {
    // Middleware
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World');
    })
    // Users
    app.get('/users', userController.findUsers)
    app.post('/users', userController.createUsers)
    app.get('/users/:id', userController.findUser)
    app.patch('/users/:id', userController.updateUser)
    app.delete('/users/:id', userController.deleteUser)

    // Rovers
    app.get('/rovers', roverController.findRovers)
    app.post('/rovers', roverController.createRovers)
    app.get('/rovers/:id', roverController.findRovers)
    app.patch('/rovers/:id', roverController.updateRover)
    app.delete('/rovers/:id', roverController.deleteRover)

    // Missions
    app.get('/missions', missionController.findMissions)
    app.post('/missions', missionController.createMissions)
    app.get('/missions/:id', missionController.findMission)
    app.patch('/missions/:id', missionController.updateMission)
    app.delete('/missions/:id', missionController.deleteMission)
    
    
    app.listen(8000, () => {
        console.log("Server has started at port 8000");
    })
}).catch((error) => {

    app.get('/', (req, res) => {
        res.send('ERROR CONNECTION MONGO DB');
    })

    app.listen(8000, () => {
        console.log("Server has started at port 8000");
    }) 
})
