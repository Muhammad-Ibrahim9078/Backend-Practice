import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String, 
            required: true,
        },
    },
    {
        collection: "IB_Dev",
        timestamps: true
    }
);

const UserModal = mongoose.model("User", userSchema);
export default UserModal;