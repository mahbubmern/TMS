import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { mongodbConnection } from "./config/mongodbConnection.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import incomingRoute from "./routes/incomingRoute.js";
// import outgoingRoute from "./routes/outgoingRoute.js";
import taskRoute from "./routes/taskRoute.js";
import userPassRoute from "./routes/userPassRoute.js";
import userPersonalRoute from "./routes/userPersonalRoute.js";
import userPhotoRoute from "./routes/userPhotoRoute.js";
import todoRoute from "./routes/todoRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import fileFolderRoute from "./routes/fileFolderRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
// initialization
const app = express();
import path from "path";

const __dirname = path.resolve();

//set PORT

const PORT = process.env.PORT || 9090;

// set Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Set Static Folder
app.use("/files", express.static(path.join(__dirname, "../Files/Incoming")));

// set Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/incoming", incomingRoute);
// app.use("/api/v1/outgoing", outgoingRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/v1/userpass", userPassRoute);
app.use("/api/v1/userpersonal", userPersonalRoute);
app.use("/api/v1/userphoto", userPhotoRoute);
app.use("/api/v1/todo", todoRoute);
app.use("/api/v1/department", departmentRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/dashboard/filemanager", fileFolderRoute);

//error handler
app.use(errorHandler);

// Listen

app.listen(PORT, (req, res) => {
  mongodbConnection();
  console.log(`Server is running on port ${PORT}`.bgGreen.black);
});
