import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "Save_Data",
        timestamps: true
    }
);

const dataModal = mongoose.model("data", dataSchema);
export default dataModal;