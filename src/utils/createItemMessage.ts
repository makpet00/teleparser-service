import dayjs from "dayjs";
import { IItem } from "../models/Item";

export const createMessage = (item: any) => {
    const parsedDate = dayjs(item.timestamp).format("DD/MM/YYYY, HH:mm");
    const message = `*${item.title}, ${item.price}*\n\n${parsedDate}\n[Open Product](${item.url})`;
    return message;
  };