import express from "express";
import {
  createFolder,
} from "../controllers/fileFolderController.js";
// import {userPhoto} from "../utils/mullter.js";

// router initialize

const router = express.Router();

// route set

router.route("/").post(createFolder);
// router
//   .route("/:id")
//   .get(getSingleUserDepartment)
//   .put(updateUser)
//   .patch(userPhoto,updateUser)
//   .delete(deleteUser);

//   router.route("/users/pending-tasks").get(getAllUserWithPendingTasks)

// export userRoute

export default router;