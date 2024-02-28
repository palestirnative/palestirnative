import { PageProps } from "$fresh/server.ts";
import { ArrowRightStartOnRectangleOutline } from "https://esm.sh/preact-heroicons";
import { createCategoryURL } from "../utils/create-url.ts";
import CountryDropdown from "../islands/form/country-dropdown.tsx";
import LanguageDropdown from "../islands/language-dropdown.tsx";

export default function Layout({ state, Component }: PageProps) {
  // do something with state here

  return (
    <>
      <nav class="relative bg-white shadow dark:bg-gray-800">
        <div class="container px-6 py-3 mx-auto">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center">
            <div class="flex items-center justify-between">
              <form action={state.pathname} method="GET">
                <div class="flex items-center">
                  <a href="#">
                    <img
                      class="w-auto h-6 sm:h-7"
                      src="/logo-long.png"
                      alt=""
                    />
                  </a>

                  <div class="hidden mx-10 md:block">
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          class="w-5 h-5 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                          </path>
                        </svg>
                      </span>

                      <input
                        hidden
                        value={state.category || ""}
                        name="category"
                      />
                      <input
                        type="text"
                        name="search"
                        value={state.search || ""}
                        class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                        placeholder="Search"
                      />
                      <input type="submit" hidden />
                    </div>
                  </div>
                  <CountryDropdown state={state} />
                </div>
              </form>

              <div class="flex lg:hidden">
                <button
                  type="button"
                  class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-24 dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center">
              <div class="flex flex-col items-center md:flex-row md:mx-1">
                <a
                  class="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/alternative"
                >
                  Alternatives
                </a>
                <a
                  class="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/boycott"
                >
                  Boycotts
                </a>
                <LanguageDropdown currentLanguage={state.selectedLanguage} />
              </div>

              <div class="my-4 md:hidden">
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                      </path>
                    </svg>
                  </span>

                  <input
                    type="text"
                    class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="py-3 mt-3 -mx-3 overflow-y-auto whitespace-nowrap scroll-hidden">
            {!state.category
              ? (
                <span
                  class="bg-blue-100 text-blue-800 font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center"
                  href={createCategoryURL("", state)}
                >
                  {state.locale["All"]}
                </span>
              )
              : (
                <a
                  class="bg-gray-100 hover:underline hover:bg-gray-200 text-gray-800 font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-400 inline-flex items-center justify-center"
                  href={createCategoryURL("", state)}
                >
                  {state.locale["All"]}
                </a>
              )}
            {state.categories.map((category) => (
              category.nameSlug === state.category
                ? (
                  <span
                    class="bg-blue-100 text-blue-800 font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center"
                    href={createCategoryURL(category.nameSlug, state)}
                  >
                    {category.icon} {category.name}
                  </span>
                )
                : (
                  <a
                    class="bg-gray-100 hover:underline hover:bg-gray-200 text-gray-800 font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-400 inline-flex items-center justify-center"
                    href={createCategoryURL(category.nameSlug, state)}
                  >
                    {category.icon} {category.name}
                  </a>
                )
            ))}
          </div>
        </div>
      </nav>
      <div class="flex relative min-h-screen bg-gray-100 dark:bg-gray-900">
        <div class="flex-1">
          <Component />
        </div>
      </div>
    </>
  );
}
