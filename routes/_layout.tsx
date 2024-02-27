import { PageProps } from "$fresh/server.ts";
import { ArrowRightStartOnRectangleOutline } from "https://esm.sh/preact-heroicons";

export default function Layout({ state, Component }: PageProps) {
  // do something with state here
  return (
    <>
      <nav class="bg-white shadow dark:bg-gray-800">
        <div class="container px-6 py-4 mx-auto">
          <div class="lg:flex lg:items-center">
            <div class="flex items-center justify-between">
              <a href="#">
                <img class="w-auto h-6 sm:h-7" src="/logo-long.png" alt="" />
              </a>

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
                    x-show="isOpen"
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

            <div class="absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center lg:justify-between">
              <div class="flex flex-col text-gray-600 capitalize dark:text-gray-300 lg:flex lg:px-16 lg:-mx-4 lg:flex-row lg:items-center">
                <a
                  href="/boycott"
                  class="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Boycotts
                </a>
                <a
                  href="/alternative"
                  class="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Alternatives
                </a>
                <a
                  href="/category"
                  class="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Categories
                </a>
              </div>

              <div class="flex justify-center mt-6 lg:flex lg:mt-0 lg:-mx-2">
                <a
                  href="/signout"
                  class="mx-2 text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Facebook"
                >
                  <ArrowRightStartOnRectangleOutline className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
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
