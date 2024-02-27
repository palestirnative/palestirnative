import { setCookie } from "$std/http/cookie.ts";
import { generateToken } from "./tokens.ts";

export default async function generateAuthCookie(user, url, existingHeaders?) {
  const headers = existingHeaders || new Headers();

  const token = await generateToken(user);

  setCookie(headers, {
    name: "auth",
    value: token, // this should be a unique value for each session
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "Lax", // this is important to prevent CSRF attacks
    domain: url.hostname,
    path: "/",
    secure: true,
  });

  return headers;
}
