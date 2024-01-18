import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict } from "date-fns";
import { User } from "@clerk/nextjs/server"; // fetches the currently active user's information from the Clerk's backend API
import { UserResource } from "@clerk/types"; // fetches the currently active user's information from the Clerk's frontend API


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function relativeDate(from: Date) {
  return formatDistanceToNowStrict(from, { addSuffix: true });
}


/*
The / characters at the start and end of the regular expression are delimiters. They indicate where the regular expression pattern starts and ends.
The /g at the end is a flag that modifies the behavior of the regular expression. The g flag stands for "global", which means the regular expression should match all occurrences in the string, not just the first one. The g flag also affects methods like replace. Without the g flag, replace only replaces the first match. With the g flag, it replaces all matches.
So, the main use of the /g flag is when you want to find or replace all matches in a string, not just the first one.

The ^ and $ characters are special characters in regular expressions. They are called "anchors".
^ is the start-of-string anchor. It means "the following pattern should start at the beginning of the string". For example, /^abc/ would match "abc" at the start of a string, but not "abc" in the middle or at the end of a string.
$ is the end-of-string anchor. It means "the preceding pattern should be at the end of the string". For example, /abc$/ would match "abc" at the end of a string, but not "abc" at the start or in the middle of a string.

So, if you see a regular expression like /^abc$/, it means "match the string exactly and completely to 'abc'". It won't match "abc" if it's part of a larger string, only if it's a string on its own.
In summary, / are delimiters, /g is a global flag, and ^ and $ are start and end of string anchors. They all serve different purposes in regular expressions.
*/
export function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replaces multiple consecutive spaces with a single hyphen
    .replace(/[^\w-]+/g, ""); // Removes all characters from the string that are NOT alphanumeric, underscores, or hyphens. The + allows the regular expression to match one or more of these characters, and the g flag makes it replace all occurrences in the string.
}


export function isAdmin(user: UserResource | User) {
  return user.publicMetadata?.role === "admin";
}