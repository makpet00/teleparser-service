import { ScrapingService } from './service/scrapingService';
import { CHAT_ID } from './constants/chatId';
import { API_KEY } from './constants/apiKey';
import { Bot } from "./bot/bot"
import { DatabaseRequestor } from './service/databaseRequestor';

class Main {
    constructor() {
        const db = new DatabaseRequestor()
        const bot = new Bot(API_KEY, CHAT_ID)
        const interval = setInterval(() => {
            ScrapingService.scrapeAllTrackers(bot.bot)
        }, 10000)
        
        console.log('Service is up and running')
    }
}

const main = new Main()