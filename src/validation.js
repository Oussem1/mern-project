const Joi = require('@hapi/joi')

// Register Validation
const registerValidation = (req) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        pseudo: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
    }

    //VALIDATE DATA
    return Joi.validate(req.body, schema);

}
const loginValidation = (req) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    }

    //VALIDATE DATA
    return Joi.validate(req.body, schema);

    
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation