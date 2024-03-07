import { Head } from "$fresh/runtime.ts";
import { AppState } from "./_middleware.ts";

export default function Error404({ state }: { state: AppState }) {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <section class="bg-white dark:bg-gray-900 ">
        <div class="container flex items-center min-h-screen px-6 py-12 mx-auto">
          <div>
            <p class="text-sm font-medium text-green-500 dark:text-green-400">
              {state.locale["404 error"]}
            </p>
            <h1 class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
              {["We can't find that page"]}
            </h1>
            <p class="mt-4 text-gray-500 dark:text-gray-400">
              {state
                .locale[
                  "Sorry, the page you are looking for doesn't exist or has been moved"
                ]}
            </p>

            <div class="flex items-center mt-6 gap-x-3">
              <button
                // deno-lint-ignore fresh-server-event-handlers
                onClick={() => history.back()}
                class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 rtl:rotate-180"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>

                <span>{state.locale["Go back"]}</span>
              </button>

              <a
                href="/"
                class="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600"
              >
                {state.locale["Take me home"]}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
