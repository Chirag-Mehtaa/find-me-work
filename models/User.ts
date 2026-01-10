import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "super_admin" | "admin" | "user";
  isActive: boolean;
  // 👇 Embedding full job details here
  bookmarks: {
    _id: string; // This will store the string ID (e.g., "123" or "czww...")
    job_title: string;
    employer_name: string;
    employer_logo?: string;
    job_city?: string;
    apply_link?: string;
    source?: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },

    // 🔥 CHANGE: Storing the full job object directly
    bookmarks: [
      {
        // We explicitly define _id as String to prevent Mongoose from auto-generating an ObjectId
        _id: { type: String, required: true }, 
        job_title: { type: String },
        employer_name: { type: String },
        employer_logo: { type: String },
        job_city: { type: String },
        apply_link: { type: String },
        source: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite error during Next.js hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;