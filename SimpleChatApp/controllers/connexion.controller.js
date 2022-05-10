//Foutre les import et tout ici je m'en rappelle plus
const express = require('express')
const axios = require('axios').default;
exports.postConnexion = (req, res) => {
    const {body} = req;
    //console.log(body);
    axios.post('http://localhost:8080/connexion', {
        email: body.email,
        password: body.password,
        })
        .then(function (response) {
            res.render("custom",{user:response.data});
            console.log("ok test", response.data)
    }).catch(function (error) {console.log(error);});

}
exports.connexion = (req,res)=>{
    res.end();
}