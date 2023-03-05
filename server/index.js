import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import { register } from "./controllers/auth.js";
import { users, posts } from "./data/index.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Post from "./models/Post.js";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import path from "path";

/** Configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Enable dotenv for use*/
dotenv.config();

/** Establishing application use of technologies */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/** Sets directory of where we keep our assets - this will be stored locally as this is not a enterprise production, for real time production this would be stored in a proper cloud storage such as S3 */
app.use("/assets", express.static(path.join(__dirname, 'public/asseets')));

/** File Storage Configurations for Multer */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

/* Routes With Files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/** Mongoose Setup 
 * * For MONGO_URL - do not end this line of code with a semicolon or it will disrupt connection
*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // For adding initial data - do ONCE
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`));