import { getCookies } from "$std/http/cookie.ts";
import generateAuthCookie from "./generateAuthCookie.ts";
import { decrypt } from "./tokens.ts";

export default async function checkAuth(req) {
  const cookies = getCookies(req.headers);

  if (!cookies.auth) {
    throw new Error("Unauthorized");
  }

  const user = await decrypt(cookies.auth);

  const headers = await generateAuthCookie(user, req.url);

  return { user, headers };
}
