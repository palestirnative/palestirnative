import { setCookie } from "$std/http/cookie.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
   GET(req, _ctx) {
    const url = new URL(req.url);
    const language = url.searchParams.get("language") || "en";

    const headers = new Headers();
    setCookie(headers, {
      name: "language",
      value: language,
      // 3 years
      maxAge: 60 * 60 * 24 * 365 * 3,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    headers.set("Location", req.referrer || "/");

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
