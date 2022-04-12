const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

PORT = process.env.PORT || 8000

const options = {
    definition: {
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express Library doc'
        },
        servers: [
            {
                url: `http//localhost:${PORT}`
            }
        ]
    },
    apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options)



const app = express();
// console.log(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`)
mongoose.connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
).then(() => {
    // Middleware
    app.use(express.json());

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

    app.get('/', (req, res) => {
        res.send('Hello World');
    })

    /**
   * @swagger
   * /api/users:
   *   get:
   *     description: Get all users
   *     responses:
   *       200:
   *         description: Success
   * 
   */
  app.get('/api/users', (req, res) => {
    res.send()
  });

    //AUTH Middlewere
    app.get('/api/user', authRoute);

    // Users
    app.get('/api/', userRoute)
    app.post('/api/', userRoute)
    app.patch('/api/', userRoute)
    app.delete('/api/', userRoute)

    app.listen(PORT, () => {
        console.log(`Server has started at port ${PORT}`);
    })
}).catch((error) => {

    app.get('/', (req, res) => {
        res.send('ERROR CONNECTION MONGO DB');
    })

    app.listen(PORT, () => {
        console.log(`Server has started at port ${PORT}`);
    })
})
