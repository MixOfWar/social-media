import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

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

/** Mongoose Setup 
 * * For MONGO_URL - do not end this line of code with a semicolon or it will disrupt connection
*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));