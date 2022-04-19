const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routes/users')
const missionRoute = require('./routes/missions')
const roverRoute = require('./routes/rovers')
const loginRoute = require('./routes/login')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser');
const path = require('path')

PORT = process.env.PORT || 8080

const app = express();

const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'SpaceX REST API',
            description: 'Example of REST API ',
            version: '1.0.0',
        },
        servers : [
            {
                url: 'http://localhost:8080'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [`${path.join(__dirname, "./routes/*js")}`]
}

const swaggerDocs = swaggerJsDoc(swaggerSpec)


mongoose.connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
).then(() => {
    app.use(express.json());
    app.use(bodyParser.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

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
