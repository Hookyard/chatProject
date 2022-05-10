const {connect} = require('mongoose')

function dbConnexion () {
    connect("mongodb://localhost:27017/authentification")
    .then(() => console.log("Connexion base de donnée"))
    .catch(error => console.log(error))
}

module.exports = dbConnexion