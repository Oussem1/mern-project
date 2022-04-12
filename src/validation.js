const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    pseudo: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
})

// Register Validation
const registerValidation = (req) => {
    
    //VALIDATE DATA
    return schema.validate(req.body).error;

}

const loginValidation = (req) => {

    //VALIDATE DATA
    return schema.validate(req).error;

    
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation