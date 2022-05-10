const joi = require('joi')

function userValidator(body) {
    const userValidatorSignUp =  joi.object({
        firstName : joi.string().min(2).max(20).trim().required(),
        lastName :joi.string().min(2).max(20).trim().required(),
        email : joi.string().email().trim().required(),
        password : joi.string().min(2).max(30).required()
    })

    const userValidationLogin = joi.object({
        email : joi.string().email().trim().required(),
        password : joi.string().min(2).max(30).required()
    })

    return {
        userValidatorSignUp : userValidatorSignUp.validate(body),
        userValidationLogin : userValidationLogin.validate(body)
}
}

module.exports = userValidator