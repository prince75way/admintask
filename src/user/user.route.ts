import { Router } from "express";
import { catchError } from "../middleware/catcherror.middleware";
import * as userValidator from './user.validation';
import * as userController from './user.controller';
import { createUserAndSendEmail } from "./user.controller";
import upload from "../multer.config";
const router = Router();

router
  .post("/login", userValidator.loginUser, catchError, userController.loginUser)

 

.post("/send-email", createUserAndSendEmail)
.patch("/blockuser", userValidator.blockUser, catchError, userController.blockUser)
.patch("/disable2fa", catchError, userController.disableTwoFactorAuth)

.patch('/update-password', userValidator.updatePassword, catchError, userController.updatePassword)
.post('/forgot-password',userValidator.forgotPasswordValidation, catchError, userController.forgotPassword)


.patch("/profile-image", upload.single("profileImage"), catchError, userController.uploadProfileImage)





export default router;
