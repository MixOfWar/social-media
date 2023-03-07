import Post from "../models/Post.js";
import User from "../models/User.js";

/** Populate Query Setup */
const populateQuery = [
  {
    path: 'author',
    select: [
      'firstName',
      'lastName',
      'picturePath',
    ]
  },
  {
    path: 'likes',
    select: [
      'firstName',
      'lastName',
      'picturePath',
    ]
  },
  {
    path: 'comments',
    populate: {
      path: 'author',
      select: [
        'firstName',
        'lastName',
        'picturePath',
      ]
    }
  }
]


/* Post */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      description, 
      author: user._id,
      likes: [],
      comments: [],
      location: location || "",
      picturePath: picturePath || "",
    });
    let savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* Get */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate(populateQuery);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* Patch */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    let post = await Post.findById(id);
    const isLiked = post.likes.includes(userId);

    if (isLiked) {

      let likedIndex = post.likes.indexOf(userId)
      post.likes.splice(likedIndex, 1)
    } else {
      /** adds userId to likes array */
      post.likes.push(userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    ).populate(populateQuery);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/** Patch */
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;
    const comment = {
      text: text,
      author: userId,
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: comment }
      },
      { new: true }
    ).populate(populateQuery);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/** Delete */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, commentId } = req.body;
    let post = await Post.findById(id);

    if (!post) {
      return response.status(422).json({ error: "Cannot find post." })
    }

    let commentIndex = post.comments.indexOf((comment) => comment._id === commentId)

    if (post.comments[commentIndex].author === userId) {
      post.comments = post.comments.filter((comment._id !== commentId))

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { comments: post.comments },
        { new: true }
      ).populate(populateQuery);

      res.status(200).json(updatedPost);
    } else {
      return response.status(401).json({ error: "Not Authorized to delete comment." })
    }

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};