import { IItem } from "../models/Item";
import { ITracker } from "../models/Tracker";
import { DatabaseRequestor } from "./databaseRequestor";
import { ScrapingService } from "./scrapingService";
import { createMessage } from "../utils/createItemMessage";

export class MessageHandler {
  trackingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {}

  static async onAllTrackersRequest(ctx: any) {
    return ctx.scene.enter("allTrackers");
  }

  static async onNewTrackerRequest(ctx: any) {
    return ctx.scene.enter("newTracker");
  }

  static async onScrapingStart(ctx: any) {
    const response = await DatabaseRequestor.getUserTrackers(
      ctx.message.chat.id
    );
    const trackers = response.data;
    if (!trackers || trackers.length < 1) {
      await ctx.reply("No trackers were found. ❌");
      return;
    }
    trackers.forEach(async (tracker) => {
      const trackerId = tracker._id.toString();
      const response = await DatabaseRequestor.getTrackerItems(trackerId);
      const items = await ScrapingService.scrapeItems(tracker.url, trackerId);
      const existingItems = response.data;
      let itemsToSave = [];

      if (existingItems) {
        const filteredItems = items.filter((item) =>
          existingItems.some((existingItem) => existingItem.id === item?.id) && (item?.price ?? 0) > 100
        );
        if (filteredItems.length < 1) {
          console.log("No new items were found!");
          return;
        }
        itemsToSave = filteredItems;
      } else {
        itemsToSave = items;
      }

      for (const item of itemsToSave) {
        const response = await DatabaseRequestor.addItem(item);
        if (!response.success) {
          console.log('Error while saving item into the database')
        }

        const message = createMessage(item)
        ctx.replyWithMarkdown(message)
      }
    });
  }
}
