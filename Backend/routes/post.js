const express = require("express");
const Post = require('../models/post');

const routes = express.Router();


routes.post("", (req, res, next) => {
  const post = Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then((data) => {
      res.status(201).json({
        message: 'Post added successfully',
        id: data._id
      });
    });

});

routes.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: "Post Not found"
        })
      }
    })
})

routes.put("/:id", (req, res, next) => {
  const post = {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  }
  Post.updateOne({
      _id: req.params.id
    }, post)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Update Successful"
      })
    })
})

routes.get("", (req, res, next) => {
  Post.find()
    .then((document) => {

      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: document
      });
    })

});

routes.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.status(200).json({
        message: 'deletion Successful',
      });
    })

})

module.exports = routes;