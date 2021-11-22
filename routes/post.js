const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
//create a post
router.post('/', async function (req, res) {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//update a post
router.put('/:id', async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('the post has been updated')

        }
        else {
            res.status(403).json('you can update only your post')
        }

    }
    catch (err) {
        res.status(500).json(err)
    }

})
//delete a post
router.delete('/:id', async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json('the post has been deleted')

        }
        else {
            res.status(403).json('you can delete only your post')
        }

    }
    catch (err) {
        res.status(500).json(err)
    }

})
//like/dislike a post
router.put('/:id/like', async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await Post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The post has been updated")
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('The post has been disliked')
        }

    }
    catch (err) {
        res.status(500).json(err)
    }


})
//get a post
router.get("/:id", async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//get timeline posts
router.get("/timeline/all", async function (req, res) {
    // let postArray = []
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.json(userPost.concat(...friendPosts))
    }
    catch (err) {
        return res.status(500).json(err)
    }
})
module.exports = router