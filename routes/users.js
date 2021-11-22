const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
//updateuser
router.put('/:id', async function (req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json('Account has been updated')
        }
        catch (err) {
            return res.send(500).json(err)
        }
    }
    else {
        return res.status(403).json("You can only update your account")
    }
})
//deleteuser
router.delete('/:id', async function (req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Account has been deleted successfully')
        }
        catch (err) {
            return res.send(500).json(err)
        }
    }
    else {
        return res.status(403).json("You can delete only your account")
    }
})
//getauser
router.get('/:id', async function (req, res) {
    try {
        const user = await User.findById(req.params.id)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//followauser
router.put("/:id/follow", async function (req, res) {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)//kaslai follow gaerna chahekochata
            const currentUser = await User.findById(req.body.userId)//kasle follow gardai cha
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(200).json("user has been followed")
            }
            else {
                return res.status(403).json('You already followed this user')
            }


        }
        catch (err) {
            res.status(500).json(err)
        }

    }
    else {
        res.status(403).json('you cannot follow yourself')
    }
})
//unfollow user
router.put("/:id/unfollow", async function (req, res) {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json("user has been unfollowed")
            }
            else {
                return res.status(403).json('You dont follow this user')
            }


        }
        catch (err) {
            res.status(500).json(err)
        }

    }
    else {
        res.status(403).json('you cannot unfollow yourself')
    }
})
module.exports = router