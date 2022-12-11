import mongoose from "mongoose";

export interface ITracker {
    _id: string, 
    url: string,
    title: string,
    chatId: string
}

const trackerSchema = new mongoose.Schema<ITracker>({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
    },
})

export const Tracker = mongoose.model("Tracker", trackerSchema);
