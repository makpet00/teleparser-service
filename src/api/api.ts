import express from "express";
import cors from "cors";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { ScrapingService } from "../service/scrapingService";

export class RestAPI {
  constructor(bot: Telegraf<Context<Update>>) {
    const app = express();
    app.use(cors());
    app.get("/run", (req, res) => {
      console.log("Request received");
      ScrapingService.scrapeAllTrackers(bot);
    });
    app.listen(8080, "0.0.0.0", () => {
      console.log(`Listening on port 8080`);
    });
  }
}
