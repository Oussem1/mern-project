const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routes/users')
const missionRoute = require('./routes/missions')
const roverRoute = require('./routes/rovers')
const loginRoute = require('./routes/login')
const Joi = require('@hapi/joi');

PORT = process.env.PORT || 8000

const app = express();

mongoose.connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
).then(() => {
    app.use(express.json());
;

    //AUTH Middlewere
    app.use('/', loginRoute);

    // Users
    app.use('/', userRoute)
    app.use('/', missionRoute)
    app.use('/', roverRoute)

    app.listen(PORT, () => {
        console.log(`Server has started at port ${PORT}`);
    })
}).catch((error) => {

    app.get('/', (req, res) => {
        res.send('ERROR CONNECTION MONGO DB');
    })

    app.listen(PORT, () => {
        console.log(`ERROR on port ${PORT}`);
    })
})
