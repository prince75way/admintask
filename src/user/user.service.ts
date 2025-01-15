
import userSchema from "./user.schema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CreateUserDTO } from "./user.dto";

dotenv.config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';  // Fallback if env is missing

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using default_secret_key. This is insecure for production.');
}

// Function to create a JWT token
const createToken = (user: Omit<CreateUserDTO, "createdAt" | "updatedAt">) => {
  const payload = {
    id: user._id,  // Convert ObjectId to string
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });  // Adjust expiration as needed
};



export const loginUser = async (data: CreateUserDTO) => {
  try {
    const user = await userSchema.findOne({ email: data.email });
    // console.log("user is: ",user)

    if (!user) {
      return { message: 'User not found' };
    }
    console.log('user enter password is:',data.password)
    console.log('user enter password is:',user.password)

    const isPasswordMatch = await bcrypt.compare( data.password,user.password);
    console.log('Password comparison result:', isPasswordMatch);
    if (!isPasswordMatch) {
      return { message: 'Invalid password' };
    }

    const { password, ...userWithoutPassword } = user.toObject();
    return { message: 'Success login', user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'An error occurred during login', error };
  }
};


export const updatePassword = async (email: string, currentPassword: string, newPassword: string) => {
  const user = await userSchema.findOne({ email });
  if (!user) {
    return { success: false, message: "User not found." };
  }

  const isMatch = await user.validatePassword(currentPassword);
  if (!isMatch) {
    return { success: false, message: "Current password is incorrect." };
  }

  user.password = newPassword; // The pre-save hook will hash this
  await user.save();
  return { success: true };
};

