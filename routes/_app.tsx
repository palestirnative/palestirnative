import { type PageProps } from "$fresh/server.ts";

const rtlLanguages = [
  "ar",
  "fa",
];

export default function App({ Component, state }: PageProps) {
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nosifer&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body class="font-sans" f-f-client-nav>
        <Component />
      </body>
    </html>
  );
}
