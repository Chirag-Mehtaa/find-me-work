import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "super_admin" | "admin" | "user";
  isActive: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ye check zaruri hai taaki Next.js hot-reload me model overwrite na kare
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;