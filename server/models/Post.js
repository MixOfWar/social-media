import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    description: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    comments: [
      {
        text: {
          type: String,
          required: true, 
          maxlength: 500,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        created: {
          type: Date,
          default: Date.now(),
        }
      }
    ],
    location: String,
    picturePath: String,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;