const express = require("express");

const PostController = require("../controllers/post");

const checkAuth = require('../middlewarre/check-auth');
const extractFile = require('../middlewarre/file');

const routes = express.Router();


routes.post("", checkAuth , extractFile , PostController.createPost );

routes.put("/:id",checkAuth, extractFile , PostController.updatePost );

routes.get("/:id", PostController.getPost );

routes.get("", PostController.getPosts );

routes.delete("/:id", checkAuth, PostController.deletePost );

module.exports = routes;
