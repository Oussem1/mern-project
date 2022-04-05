const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/users')

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

    app.get('/users', userController.findUsers)
    app.post('/users', userController.createUsers)
    app.get('/users/:id', userController.findUser)
    app.patch('/users/:id', userController.updateUser)
    app.delete('/users/:id', userController.deleteUser)
    
    
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
