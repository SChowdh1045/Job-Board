import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({}); // Gotta do this according to the Clerk docs

// The following regex will match any string that starts with "admin", followed by any number of any characters. The (admin) and (.*) parts of the match will be captured in separate groups.
// The dot . is a special character in regex that matches any character except for newline characters, and the asterisk * is a quantifier that means "zero or more of the preceding element".
// So in the context of authentication, this regex will match any path that starts with /admin, followed by any number of any characters.
export const config = {
    matcher: ["/(admin)(.*)"],
};