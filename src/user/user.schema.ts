import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
interface IUser extends Document {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  password: string;
  accessToken?: string;
  refreshToken?: string;
  status: "Active" | "Blocked";
  emailVerified: boolean;
  onboardingProcess: "Profile" | "Qualification" | "KYC" | "Completed";
  kycStatus: "Pending" | "Verified" | "Rejected";
  kycDocumentUrl?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, default:"" },
    email: { type: String,  unique: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    password: { type: String,  },
    accessToken: { type: String },
    refreshToken: { type: String },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    emailVerified: { type: Boolean, default: false },
    onboardingProcess: {
      type: String,
      enum: ["Profile", "Qualification", "KYC", "Completed"],
      default: "Profile",
    },
    kycStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    kycDocumentUrl: { type: String },
   

    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);


// Define a secret key for token generation (use environment variables for security)
const TOKEN_SECRET = process.env.TOKEN_SECRET||"Prince" ;

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }

  if (this.isNew) {
    // Generate a token using the user's email as payload
    const tokenPayload = { email: this.email };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '1h' });
    this.accessToken = token;
  }

  next();
});

// Method to validate password
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
