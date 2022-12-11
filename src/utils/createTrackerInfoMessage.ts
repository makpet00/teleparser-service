import { ITracker } from "../models/Tracker";

export const createTrackerInfoMessage = (tracker: ITracker) => {
  const message = `*${tracker.title}*`;
  const settings = { 
    parse_mode: 'Markdown', 
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Link",
            callback_data: "Open Link"
          },
          {
            text: "Remove Tracker",
            callback_data: "Remove Tracker"
          }
        ]
      ]
    } 
  };
  return { message, settings }
};
