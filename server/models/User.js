import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
});

export default mongoose.model("User", UserSchema);
