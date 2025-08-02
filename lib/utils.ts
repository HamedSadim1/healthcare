import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a value to a JSON string and then parses it back to a JavaScript object.
 * This can be useful for creating a deep copy of an object.
 *
 * @param value - The value to be stringified and parsed.
 * @returns The parsed value as a JavaScript object.
 */
export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

/**
 * Converts a given File object to a URL string.
 *
 * @param {File} file - The file to be converted to a URL.
 * @returns {string} The URL representing the file.
 */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
/**
 * Formats a given date string or Date object into various date and time formats.
 *
 * @param dateString - The date string or Date object to format.
 * @param timeZone - The time zone to use for formatting. Defaults to the user's local time zone.
 * @returns An object containing formatted date and time strings:
 * - `dateTime`: Full date and time string (e.g., '25 Oct 2023, 8:30')
 * - `dateDay`: Date string with weekday (e.g., 'Mon, 25/10/2023')
 * - `dateOnly`: Date string without time (e.g., '25 Oct 2023')
 * - `timeOnly`: Time string without date (e.g., '8:30')
 */
export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    // use 12-hour clock (true) or 24-hour clock (false),
    timeZone: timeZone, // use the provided timezone
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: timeZone, // use the provided timezone
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "nl-BE",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "nl-BE",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "nl-BE",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "nl-BE",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * Encrypts a given passkey using Base64 encoding.
 *
 * @param passkey - The passkey to be encrypted.
 * @returns The Base64 encoded string of the passkey.
 */
export function encryptKey(passkey: string) {
  return btoa(passkey);
}

/**
 * Decrypts a given passkey using Base64 decoding.
 *
 * @param passkey - The encrypted passkey as a string.
 * @returns The decrypted key as a string.
 */
export function decryptKey(passkey: string) {
  return atob(passkey);
}
