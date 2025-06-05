import mongoose from "mongoose";
import utils from "../utils/index.js";
import bcrypt from "bcryptjs";
const { uniqueID } = utils;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        default: () => uniqueID(),
    },
    admin: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});
userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);
};
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
const User = mongoose.model("User", userSchema);

export default User;
    