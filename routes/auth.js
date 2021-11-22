const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
//Register
router.post('/register', async function (req, res) {
    const salt = await bcrypt.genSalt(10)
    //hashedPassword
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //create new user
    const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.status(200).send(savedUser)
    }
    catch (err) {
        res.status(500).send(err)
    }

})
//Login
router.post('/login', async function (req, res) {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send('Email not found')
    }
    const matchedUser = await bcrypt.compare(req.body.password, user.password)
    if (!matchedUser) {
        return res.status(400).send('Invalid user')
    }
    return res.send('Sucessfully loggedin')
})
module.exports = router