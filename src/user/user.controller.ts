import { EditorSettings } from './../../node_modules/typescript/lib/typescript.d';
import bcrypt from 'bcrypt';
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';
import * as userService from './user.service';
import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';
import userSchema from "./user.schema";
import dotenv from 'dotenv';

dotenv.config();



export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,  // Add your email in .env
        pass: process.env.EMAIL_PASS,  // Add your email password in .env
      },
    });

    const mailOptions = {
      from: '"Your App Name" <no-reply@yourapp.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${"resetLink"}">${"jdkfjdkjf"}</a>
             <p>If you didn't request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
};


export const createUserAndSendEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    // Create user
    const newUser = new userSchema({
      email,

    });

    await newUser.save();

    // Send email after user is created
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables for sensitive data
        pass: process.env.EMAIL_PASS, // Use environment variables for sensitive data
      },
    });

    const mailOptions = {
      from: '"Your App Name" <digraprince7@gmail.com>',
      to: email,
      subject: "Welcome to Our Service!",
      text: `Hello ,\n\nYour account has been created successfully.\nPlease click the link below to set your password:\n\n[Set Password Link]\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User created and email sent", userId: newUser._id });
  } catch (error) {
    console.error("Error creating user or sending email:", error);
    res.status(500).json({ error: "Failed to create user or send email" });
  }
};




export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await userSchema.findById(userId);
    // console.log("User is: ",user)
    if (!user ) {
      res.status(404).json({ error: 'User not found or password not set' });
      return;
    }

  

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};



export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.loginUser(req.body);
    res.send(result);
});



export const blockUser = async (req: Request, res: Response): Promise<void> => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || "mysecrettoken";
  const { userId,block, authToken } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(authToken, TOKEN_SECRET) as { email: string; };
    // Check if the requester is an admin
    const requestingUser = await userSchema.findOne({email:decoded.email});
    if (!requestingUser || requestingUser.role !== "ADMIN") {
      res.status(403).json({ error: "Access denied. Only admins can block or unblock users." });
      return;
    }

    // Proceed with blocking or unblocking the user
    const user = await userSchema.findByIdAndUpdate(
      userId,
      { status: block ? "Blocked" : "Active" },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.status(200).json({ message: `User has been ${block ? 'blocked' : 'unblocked'}.`, user });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};





// Disable 2FA for a user
export const disableTwoFactorAuth = async (req: Request, res: Response): Promise<void> => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || "mysecrettoken";
  const {  authToken } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(authToken, TOKEN_SECRET) as { email: string; };
    // Check if the requester is an admin
    const requestingUser = await userSchema.findOne({email:decoded.email});
    const user = await userSchema.findByIdAndUpdate(
      requestingUser?._id,
      { twoFactorEnabled: false },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Two-factor authentication disabled.", user });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ error: 'Failed to disable two-factor authentication' });
  }
};





export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  const { authToken } = req.body;

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY as string) as { userId: string };
    const userId = decoded.userId;

    const user = await userSchema.findByIdAndUpdate(
      userId,
      { kycDocumentUrl: req.file.path },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile image updated successfully", user });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Failed to update profile image" });
  }
};
