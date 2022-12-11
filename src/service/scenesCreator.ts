import { Markup, Scenes } from "telegraf";
import { WizardContextWizard } from "telegraf/typings/scenes";
import { urlRegex } from "../constants/urlRegex";
import { ITracker } from "../models/Tracker";
import { createTrackerInfoMessage } from "../utils/createTrackerInfoMessage";
import { DatabaseRequestor } from "./databaseRequestor";

export class ScenesCreator {
  stage: Scenes.Stage<any, Scenes.SceneSessionData>;

  leaveButton = {
      force_reply: true,
      resize_keyboard: true,
      keyboard: [["Leave"]],
  };

  constructor() {
    const newTrackerSequence = this.newTrackerSequence();
    const newTrackerScene = new Scenes.WizardScene(
      "newTracker",
      ...newTrackerSequence
    );

    const allTrackersSequence = this.allTrackersSequence();
    const allTrackersScene = new Scenes.WizardScene(
      "allTrackers",
      ...allTrackersSequence
    )

    const stage = new Scenes.Stage([newTrackerScene, allTrackersScene]);
    this.stage = stage;
  }

  newTrackerSequence() {
    const sequence = [
      // @ts-ignore
      async (ctx: WizardContextWizard) => {
        await ctx.reply("Provide URL for tracking 🔗", { reply_markup: { ...this.leaveButton, input_field_placeholder: 'https://www.tori.fi/'} });
        return ctx.wizard.next();
      },
      // @ts-ignore
      async (ctx: WizardContextWizard) => {
        if (ctx.message.text === 'Leave') {
          await ctx.reply("New tracker form exited", Markup.removeKeyboard())
          return ctx.scene.leave()
        } 

        ctx.session.url = ctx.message.text;

        const regex = new RegExp(urlRegex);
        if (!ctx.session.url.match(regex)) {
          await ctx.reply("Wrong URL format ❌", Markup.removeKeyboard());
          return ctx.scene.leave();
        }

        await ctx.reply("Provide a title 📝", { reply_markup: { ...this.leaveButton, input_field_placeholder: 'Tracker Title'} });
        return ctx.wizard.next();
      },
      // @ts-ignore
      async (ctx: WizardContextWizard) => {
        if (ctx.message.text === 'Leave') {
          await ctx.reply("New tracker form exited", Markup.removeKeyboard())
          return ctx.scene.leave()
        } 

        ctx.session.title = ctx.message.text;

        if (ctx.session.title.length < 1) {
          await ctx.reply("Title can't be empty ❌", Markup.removeKeyboard());
          return ctx.scene.leave();
        }
        
        const url = ctx.session.url
        const title = ctx.session.title
        const chatId = ctx.update.message.chat.id

        const response = await DatabaseRequestor.addTracker(url, title, chatId)

        if (!response.success) {
          await ctx.reply("Error while sending tracker information to database. Try again later. ❌");
          return ctx.scene.leave();
        }

        await ctx.reply("New tracker has been added! ✅");
        return ctx.scene.leave();
      },
    ];

    return sequence;
  }

  allTrackersSequence() {
    const sequence = [
      // @ts-ignore
      async (ctx: WizardContextWizard) => {
        const chatId = ctx.update.message.chat.id
        const response = await DatabaseRequestor.getUserTrackers(chatId)
        if (!response.success || response.data === null) {
          await ctx.reply("No trackers were found. ❌");
          return ctx.scene.leave();
        }
        const trackers: ITracker[] = response.data
        trackers.forEach(async (tracker) => {
          const { message, settings } = createTrackerInfoMessage(tracker)
          await ctx.reply(message, settings);
        })
        return ctx.scene.leave();
      },
      
    ];

    return sequence;
  }
}
