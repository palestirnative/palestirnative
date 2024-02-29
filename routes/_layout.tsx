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
                  <a href="/">
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
                  href="/boycott"
                >
                  🚫 Boycotts
                </a>
                <a
                  class="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/alternative"
                >
                  ✔️ Alternatives
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

      <footer class="bg-white dark:bg-gray-900">
        <div class="container p-6 mx-auto">
            <div class="lg:flex">
                <div class="w-full -mx-6 lg:w-2/5">
                    <div class="px-6">
                        <a href="#">
                            <img class="w-auto h-7" src="/logo.png" alt=""/>
                        </a>

                        {state.selectedLanguage !== "ar" && <p class="max-w-sm mt-2 text-gray-500 dark:text-gray-400">
                        وَجَاهِدُوا بِأَمْوَالِكُمْ وَأَنْفُسِكُمْ فِي سَبِيلِ اللَّهِ ذَلِكُمْ خَيْرٌ لَكُمْ إِنْ كُنْتُمْ تَعْلَمُون َ
                          </p>}

                        <p class="max-w-sm mt-2 text-gray-500 dark:text-gray-400">{state.locale["Footer subtitle"]}</p>

                        <div class="flex mt-6 -mx-2">
                            <a href="#"
                                class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                aria-label="Reddit">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20.9716667,33.5527338 L25.001,33.5527338 L25.001,27.1328007 C25.001,25.439485 25.3213333,23.7988354 27.4206667,23.7988354 C29.491,23.7988354 29.517,25.7351486 29.517,27.2404662 L29.517,33.5527338 L33.5506667,33.5527338 L33.5506667,26.4341413 C33.5506667,22.9381777 32.796,20.2505391 28.711,20.2505391 C26.7483333,20.2505391 25.432,21.3265278 24.8943333,22.3471839 L24.839,22.3471839 L24.839,20.5725357 L20.9716667,20.5725357 L20.9716667,33.5527338 Z M16.423,14.1202696 C15.1273333,14.1202696 14.0823333,15.1682587 14.0823333,16.4595785 C14.0823333,17.7508984 15.1273333,18.7992208 16.423,18.7992208 C17.7133333,18.7992208 18.761,17.7508984 18.761,16.4595785 C18.761,15.1682587 17.7133333,14.1202696 16.423,14.1202696 L16.423,14.1202696 Z M14.4026667,33.5527338 L18.4406667,33.5527338 L18.4406667,20.5725357 L14.4026667,20.5725357 L14.4026667,33.5527338 Z M9.76633333,40 C8.79033333,40 8,39.2090082 8,38.2336851 L8,9.76631493 C8,8.79065843 8.79033333,8 9.76633333,8 L38.234,8 C39.2093333,8 40,8.79065843 40,9.76631493 L40,38.2336851 C40,39.2090082 39.2093333,40 38.234,40 L9.76633333,40 Z">
                                    </path>
                                </svg>
                            </a>
                        
                            <a href="#"
                                class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                aria-label="Facebook">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z">
                                    </path>
                                </svg>
                            </a>
                        
                            <a href="#"
                                class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                aria-label="Github">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-6 lg:mt-0 lg:flex-1">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <div>
                            <h3 class="text-gray-700 uppercase dark:text-white">{state.locale["About"]}</h3>
                            <a href="/faq" class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">{state.locale["FAQ"]}</a>
                            <a href="/labels" class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">{state.locale["Palestirnative labels"]}</a>
                        </div>

                        <div>
                            <h3 class="text-gray-700 uppercase dark:text-white">{state.locale["Similar initiatives"]}</h3>
                            <a href="https://badeel.wiki/" target="_blank" class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">{state.locale["Badeel"]}</a>
                            <a href="https://www.boykot.co/" target="_blank" class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">Boykot</a>
                            <a href="https://boycott.thewitness.news/" target="_blank" class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">The Witness</a>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="h-px my-6 bg-gray-200 border-none dark:bg-gray-700"/>

            <div>
                <p class="text-center text-gray-500 dark:text-gray-400">Made with ❤️ by a Muslim person</p>
            </div>
        </div>
      </footer>
    </>
  );
}
