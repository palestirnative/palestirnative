import { PageProps } from "$fresh/server.ts";
import { AppState } from "./_middleware.ts";
import { Navigation } from "../islands/navigation.tsx";

// TODO: The state type should be defined by PageProps<AppState> but it doesn't work that way for now
// This is a workaround that should be fixed in a better way
export default function Layout({
  state,
  Component,
}: PageProps & { state: AppState }) {
  return (
    <>
      <Navigation state={state} />
      <div class="relative min-h-screen bg-gray-100 dark:bg-gray-900 pb-10">
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
                  <img class="w-auto h-7" src="/logo.png" alt="" />
                </a>

                {state.selectedLanguage !== "ar" && (
                  <p class="max-w-sm mt-2 text-gray-500 dark:text-gray-400">
                    وَجَاهِدُوا بِأَمْوَالِكُمْ وَأَنْفُسِكُمْ فِي سَبِيلِ
                    اللَّهِ ذَلِكُمْ خَيْرٌ لَكُمْ إِنْ كُنْتُمْ تَعْلَمُون َ
                  </p>
                )}

                <p class="max-w-sm mt-2 text-gray-500 dark:text-gray-400">
                  {state.locale["Footer subtitle"]}
                </p>

                <div class="flex mt-6 -mx-2">
                  <a
                    href="https://www.linkedin.com/groups/8163981/"
                    target="_blank"
                    class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="Linkedin"
                  >
                    <svg
                      class="w-5 h-5 fill-current"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.9716667,33.5527338 L25.001,33.5527338 L25.001,27.1328007 C25.001,25.439485 25.3213333,23.7988354 27.4206667,23.7988354 C29.491,23.7988354 29.517,25.7351486 29.517,27.2404662 L29.517,33.5527338 L33.5506667,33.5527338 L33.5506667,26.4341413 C33.5506667,22.9381777 32.796,20.2505391 28.711,20.2505391 C26.7483333,20.2505391 25.432,21.3265278 24.8943333,22.3471839 L24.839,22.3471839 L24.839,20.5725357 L20.9716667,20.5725357 L20.9716667,33.5527338 Z M16.423,14.1202696 C15.1273333,14.1202696 14.0823333,15.1682587 14.0823333,16.4595785 C14.0823333,17.7508984 15.1273333,18.7992208 16.423,18.7992208 C17.7133333,18.7992208 18.761,17.7508984 18.761,16.4595785 C18.761,15.1682587 17.7133333,14.1202696 16.423,14.1202696 L16.423,14.1202696 Z M14.4026667,33.5527338 L18.4406667,33.5527338 L18.4406667,20.5725357 L14.4026667,20.5725357 L14.4026667,33.5527338 Z M9.76633333,40 C8.79033333,40 8,39.2090082 8,38.2336851 L8,9.76631493 C8,8.79065843 8.79033333,8 9.76633333,8 L38.234,8 C39.2093333,8 40,8.79065843 40,9.76631493 L40,38.2336851 C40,39.2090082 39.2093333,40 38.234,40 L9.76633333,40 Z"></path>
                    </svg>
                  </a>

                  <a
                    href="#"
                    class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="Facebook"
                  >
                    <svg
                      class="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="X"
                  >
                    <svg
                      class="w-5 h-5 fill-current"
                      viewBox="0 0 512 512"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                    </svg>
                  </a>
                  <a
                    target="_blank"
                    href="https://github.com/palestirnative"
                    class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="Github"
                  >
                    <svg
                      viewBox="0 0 98 96"
                      class="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-6 lg:mt-0 lg:flex-1">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div>
                  <h3 class="text-gray-700 uppercase dark:text-white">
                    {state.locale["About"]}
                  </h3>
                  <a
                    href="/faq"
                    class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    {state.locale["FAQ"]}
                  </a>
                  <a
                    href="/labels"
                    class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    {state.locale["Palestirnative labels"]}
                  </a>
                </div>

                <div>
                  <h3 class="text-gray-700 uppercase dark:text-white">
                    {state.locale["Similar initiatives"]}
                  </h3>
                  <a
                    href="https://badeel.wiki/"
                    target="_blank"
                    class="flex items-baseline mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    <img src="/similars/badeel.png" class="w-5 h-5 mx-2" />
                    {state.locale["Badeel"]}
                  </a>
                  <a
                    href="https://www.boykot.co/"
                    target="_blank"
                    class="flex items-baseline mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    <img src="/similars/boykot.png" class="w-5 h-5 mx-2" />
                    Boykot
                  </a>
                  <a
                    href="https://boycott.thewitness.news/"
                    target="_blank"
                    class="flex items-baseline mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    <img src="/similars/witness.png" class="w-5 h-5 mx-2" />
                    The Witness
                  </a>
                  <a
                    href="https://bdnaash.com/"
                    target="_blank"
                    class="flex items-baseline mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    <img src="/similars/bdnaash.png" class="w-5 h-5 mx-2" />
                    Bdnaash
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr class="h-px my-6 bg-gray-200 border-none dark:bg-gray-700" />

          <div>
            <p class="text-center text-gray-500 dark:text-gray-400">
              Made with ❤️ by a group of Muslims
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
