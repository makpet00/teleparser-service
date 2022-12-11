import dayjs from "dayjs";
import { convertFinMonth } from "./convertFinMonth";

interface ParsedTimestamp {
  day: null | number | string;
  month: null | number | string;
  time: null | number | string;
  year: null | number | string;
}

export const convertTimestamp = (timestamp: string) => {
  const splittedTimestamp = timestamp.split(" ");
  const firstItem = splittedTimestamp[0];
  const timestampTemplate: ParsedTimestamp = {
    day: null,
    month: null,
    time: null,
    year: null,
  };

  if (firstItem === "tänään") {
    timestampTemplate.day = dayjs().date();
    timestampTemplate.month = dayjs().month() + 1;
  } else if (firstItem === "eilen") {
    timestampTemplate.day = dayjs().subtract(1, "day").date();
    timestampTemplate.month = dayjs().subtract(1, "day").month() + 1;
  } else {
    timestampTemplate.day = splittedTimestamp[0];
    timestampTemplate.month = convertFinMonth(splittedTimestamp[1]);
  }

  timestampTemplate.time = splittedTimestamp[splittedTimestamp.length - 1];
  timestampTemplate.year = dayjs().year();

  const convertedTimestampStr = `${timestampTemplate.year}-${timestampTemplate.month}-${timestampTemplate.day}  ${timestampTemplate.time}`;
  const convertedTimestamp = dayjs(
    convertedTimestampStr
  ).toISOString();

  return convertedTimestamp;
};
