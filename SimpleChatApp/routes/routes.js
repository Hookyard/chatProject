const {connexion, postConnexion} = require('../controllers/connexion.controller')
const {Router} = require('express')
const router = Router();

router.get('/connexion', connexion)
router.post('/connexionPost', postConnexion)

module.exports = router