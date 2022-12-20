import puppeteer from "puppeteer";
import Context from "telegraf/typings/context";
import { Update } from "telegraf/typings/core/types/typegram";
import { Telegraf } from "telegraf/typings/telegraf";
import { Bot } from "../bot/bot";
import { IItem } from "../models/Item";
import { ITracker } from "../models/Tracker";
import { convertTimestamp } from "../utils/convertTimestamp";
import { createMessage } from "../utils/createItemMessage";
import { DatabaseRequestor } from "./databaseRequestor";

export class ScrapingService {
  constructor() {}

  static async scrapeAllTrackers(bot: Telegraf<Context<Update>>) {
    const response = await DatabaseRequestor.getAllTrackers();
    const trackers = response.data;
    if (!trackers || trackers.length < 1) {
      return;
    }
    trackers.forEach(async (tracker: ITracker) => {
      const trackerId = tracker._id.toString();
      const userId = tracker.chatId;
      const response = await DatabaseRequestor.getTrackerItems(trackerId);
      let items: any[]
      try {
        items = await ScrapingService.scrapeItems(tracker.url, trackerId);
      } catch (e) {
        console.log(e)
        return
      } 
      const existingItems = response.data;
      let itemsToSave = [];

      if (existingItems) {
        const filteredItems = items.filter((item) => !existingItems.some(existingItem => existingItem.itemId === item?.itemId))
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
        bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' })
      }
    });
  }

  static async scrapeItems(url: string, trackerId: string) {
    console.log("Scraping " + url);
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(url);

    const items = await page.evaluate(() => {
      const selectedItems = document.querySelectorAll(".item_row_flex");
      const selectedItemsArray = Array.from(selectedItems);
      const processedItems = selectedItemsArray.map((item) => {
        const id = item.getAttribute("id");
        const title = item.querySelector(".li-title")?.textContent;
        const price = parseInt(
          item.querySelector(".list_price")?.textContent?.split(" ")[0] ?? "0"
        );
        const link = item.getAttribute("href");
        const timestamp = item
          .querySelector(".date_image")
          ?.textContent?.trim()
          ?.split("\t")
          .join("")
          .split("\n")
          .join(" ");

        if (!price || !link || price < 70) {
          return;
        }
        return { itemId: id, title, price, url: link, timestamp };
      });
      return processedItems;
    });
    await browser.close();

    const finalItems = items.filter(item => !!item)

    if (!finalItems || finalItems.length < 1) {
      console.log("No items were found in " + url);
    }

    finalItems.forEach((item: any) => {
      if (!item?.timestamp) {
        return;
      }
      item.timestamp = convertTimestamp(item.timestamp);
      item.trackerId = trackerId;
    });

    return finalItems;
  }
}
