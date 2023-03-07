import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost, deleteComment, createPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* Get */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/** Post */
router.post("/", verifyToken, createPost)

/* Patch */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/deleteComment", verifyToken, deleteComment)

export default router;