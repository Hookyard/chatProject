const passport = require('passport')
const {Router} = require('express')

const {connexion, inscription} = require('../controllers/ctrl')

const router = Router();

router.post('/inscription', inscription)
router.post('/connexion', connexion)

router.use(passport.authenticate("jwt", {session : false }))
router.get('/', (req, res) =>{
    res.send('Route protégé')
})

module.exports = router