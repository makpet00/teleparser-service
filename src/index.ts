import { ScrapingService } from './service/scrapingService';
import { CHAT_ID } from './constants/chatId';
import { API_KEY } from './constants/apiKey';
import { Bot } from "./bot/bot"
import { DatabaseRequestor } from './service/databaseRequestor';
import { RestAPI } from './api/api';

class Main {
    constructor() {
        const db = new DatabaseRequestor()
        const { bot } = new Bot(API_KEY, CHAT_ID)
        const api = new RestAPI(bot)
        
        console.log('Service is up and running')
    }
}

const main = new Main()