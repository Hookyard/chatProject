const express = require('express')
const User = require('../model/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userValidation = require('../validation/validation')
const { status } = require('express/lib/response')
const match = require('nodemon/lib/monitor/match')
const { session } = require('passport')

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

exports.inscription = (req, res) => {
    //recuperer donnée
    const {body} = req
    console.log("rssr")
    //valider donner
    const {error} = userValidation(body).userValidatorSignUp

    if(error) return res.status(401).json(error.details[0].message)
    //hash du mot de passe
    bcrypt.hash(body.password, 10)
    .then(hash => {
        if(!hash) return res.status(500).json({msg : "Server Error"})
        delete body.password
        new User({... body, password : hash})
        .save()
        .then((user) => {
            console.log(user)
            res.redirect('http://localhost:3000/connexion_inscription/index.html')
            //res.status(201).json({msg : "User Created ! "})
        })
        .catch((error) => res.status(500).json(error))
    })
    .catch((error) => res.status(500).json(error))
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
exports.connexion = (req, res) => {
    
    console.log(req.session);
    console.log(req.body);
    
    const {email, password} = req.body
    // validation de donnée
    const {error} = userValidation(req.body).userValidationLogin
    if(error) return res.status(401).json(error.details[0].message)

    // Trouver l'utilisateur dans la base de donnée

    User.findOne({email : email})
    .then(user => {
        if(!user) return res.status(404).json({msg : "user not found"})
        req.session.user = user
        // verification du mot de passe 
        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match) return res.status(500).json({msg : "Server Error"})
            res.status(200).json({
                email : user.email,
                id : user._id,
                firstName : user.firstName,
                token : jwt.sign({id : user._id}, "SECRET_KEY", {expiresIn : "12h"})
            })
            console.log(email)
            
        })
        .catch(error => res.status(500).json(error))
    })
    .catch(error => res.status(500).json(error))
}

