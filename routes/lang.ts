import { setCookie } from "$std/http/cookie.ts";

export const handler: Handler = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const language = url.searchParams.get("language");

    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: language, // this should be a unique value for each session
      // 3 years
      maxAge: 60 * 60 * 24 * 365 * 3,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: url.hostname,
      path: "/",
      secure: true,
    });
  },
};
