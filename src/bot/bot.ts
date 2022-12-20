import { session, Telegraf } from "telegraf";
import { MessageHandler } from "../service/messageHandler";
import { ScenesCreator } from "../service/scenesCreator";
import { ScrapingService } from "../service/scrapingService";

export class Bot {
  bot: Telegraf
    constructor(apiKey: string, chatId: string) {
    // Entity initialization
    this.bot = new Telegraf(apiKey);
    const scenesCreator = new ScenesCreator();

    this.bot.use(session());
    this.bot.use(scenesCreator.stage.middleware())

    this.bot.command("/trackers",(ctx: any) => MessageHandler.onAllTrackersRequest(ctx));
    this.bot.command("/new_tracker", (ctx: any) => MessageHandler.onNewTrackerRequest(ctx));
    this.bot.command("/start_scraping", (ctx: any) => ScrapingService.scrapeAllTrackers(this.bot));
    // this.bot.command("/stop_scraping", (ctx: any) => ctx.scene.enter('newTracker'));

    this.bot.launch();
  }
}
