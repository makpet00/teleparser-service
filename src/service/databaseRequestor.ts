import { MongoClient } from "mongodb"
import mongoose from "mongoose";
import { databaseUri } from "../constants/databaseUri"
import { IItem, Item } from "../models/Item";
import { Tracker } from "../models/Tracker";

export class DatabaseRequestor {
    client: mongoose.Connection

    constructor() {
        mongoose.connect(databaseUri);
        const client = mongoose.connection;
        client.on("error", console.error.bind(console, "MongoDB connection error:"));
        this.client = client
    }

    static async addTracker(url: string, title: string, chatId: string) {
        const trackerInstance = new Tracker({ url, title, chatId })
        const result = await trackerInstance.save().then(res => {
            return {
                data: res,
                success: true
            }
        }).catch(err => {
            console.error(err)
            return {
                data: null,
                success: false,
            }
        })
        return result
    }

    static async getUserTrackers(chatId: string) {
        const trackers = await Tracker.find({ chatId: chatId })
        if (trackers.length < 1) {
            return {
                data: null,
                success: false,
            }
        }
        return {
            data: trackers,
            success: true,
        }
    }

    static async getAllTrackers() {
        const trackers = await Tracker.find()
        if (trackers.length < 1) {
            return {
                data: null,
                success: false,
            }
        }
        return {
            data: trackers,
            success: true,
        }
    }

    static async addItem(item: any) {
        const itemInstance = new Item(item)
        const result = await itemInstance.save().then(res => {
            return {
                data: res,
                success: true
            }
        }).catch(err => {
            console.error(err)
            return {
                data: null,
                success: false,
            }
        })
        return result
    }

    static async getTrackerItems(trackerId: string) {
        const items = await Item.find({ trackerId: trackerId })
        if (items.length < 1) {
            return {
                data: null,
                success: false,
            }
        }
        return {
            data: items,
            success: true,
        }
    }
}