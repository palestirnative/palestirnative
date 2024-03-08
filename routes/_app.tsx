import { type PageProps } from "$fresh/server.ts";
import { AppState } from "./_middleware.ts";
import { Partial } from "$fresh/runtime.ts";

const rtlLanguages = [
  "ar",
  "fa",
];

export default function App(
  { Component, state }: PageProps & { state: AppState },
) {
  const direction = rtlLanguages.includes(state.selectedLanguage)
    ? "rtl"
    : "ltr";

  return (
    <html lang={state.selectedLanguage} dir={direction}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Palestirnative</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&family=Nosifer&display=swap"
          rel="stylesheet"
        >
        </link>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" type="text/css" href="/toastify.css" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body class="font-sans flex flex-col">
        <Partial name="body">
          <Component />
        </Partial>
      </body>
    </html>
  );
}
