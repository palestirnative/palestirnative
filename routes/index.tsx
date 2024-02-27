export const handler = {
  GET() {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/boycott",
      },
    });
  },
};
