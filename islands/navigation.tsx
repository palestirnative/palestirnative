import { createCategoryURL } from "../utils/create-url.ts";
import AutocompleteInput from "./form/autocomplete-input.tsx";
import CountryDropdown from "./form/country-dropdown.tsx";
import TagInput from "./form/tag-input.tsx";
import LanguageDropdown from "./language-dropdown.tsx";
import { useMemo, useState } from "preact/hooks";

export const Navigation = ({ state }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const list = state.boycotts.concat(
    state.alternatives.map((alternative) => ({
      ...alternative,
      productType: "alternative",
    })),
  );

  const searchOptions = useMemo(() => {
    return list
      .map((item) => ({
        nameSlug: item.nameSlug,
        label: item.name,
        value: item.name,
        logoURL: item.logoURL,
        productType: item.productType === "alternative"
          ? "alternative"
          : "boycott",
      }));
  }, [state.search]);

  const toggleMenu = () => {
    setIsMenuOpen((prev: boolean) => !prev);
  };

  const renderAlternativeBadgeClasses = () => {
    return "h-5 w-5 items-center justify-center rounded-full text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300 inline-flex items-center text-sm font-medium";
  };

  const renderBoycottBadgeClasses = () => {
    return "h-5 w-5 items-center justify-center rounded-full text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300 inline-flex items-center text-sm font-medium";
  };

  const getIconClass = () => {
    const style = state.direction === "rtl"
      ? `absolute inset-y-0 left-0 flex items-center pl-3`
      : `absolute inset-y-0 right-0 flex items-center pr-3`;
    return style;
  };

  return (
    <nav class="relative bg-white shadow dark:bg-gray-800">
      <div class="lg:container px-6 py-3 mx-auto">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div class="flex items-center justify-between">
            <form
              action={state.pathname.includes("boycott")
                ? "/boycott"
                : "alternative"}
              method="GET"
            >
              <div class="flex items-center">
                <a href="/">
                  <img class="w-auto h-6 sm:h-7" src="/logo-long.png" alt="" />
                </a>
                <div class="hidden mx-10 lg:block">
                  <div class="relative">
                    <input
                      hidden
                      value={state.category || ""}
                      name="category"
                    />
                    <AutocompleteInput
                      direction={state.direction}
                      name="alternative"
                      options={searchOptions}
                      optionTemplate={(option) => (
                        <div class="flex-col">
                          <span class="flex">
                            {option.label}
                          </span>
                          <span
                            id="badge-dismiss-default"
                            class={option?.productType === "alternative"
                              ? renderAlternativeBadgeClasses()
                              : renderBoycottBadgeClasses()}
                          >
                            {option.productType === "alternative" ? "✔️" : "🚫"}
                          </span>
                        </div>
                      )}
                      handleSelect={(item) => {
                        setSelectedProduct(item);
                        window.location.href =
                          `/${item.productType}/${item.nameSlug}`;
                      }}
                      icon={
                        <span
                          class={getIconClass()}
                        >
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
                      }
                      placeholder={"search"}
                    />
                    <input hidden type="submit" />
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
                onClick={toggleMenu}
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
              </button>
            </div>
          </div>
          <form
            action={state.pathname.includes("boycott")
              ? "/boycott"
              : "alternative"}
            method="GET"
          >
            <div
              class={`${
                isMenuOpen ? "" : "hidden"
              } absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-12 dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
            >
              <button
                type="button"
                class={`${
                  isMenuOpen ? "" : "hidden"
                } text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu`}
                onClick={() => setIsMenuOpen(false)}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div class="flex flex-col items-center md:flex-row md:mx-1">
                <a
                  class="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/boycott"
                >
                  🚫 {state.locale["Boycotts"]}
                </a>
                <a
                  class="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/alternative"
                >
                  ✔️ {state.locale["Alternatives"]}
                </a>
                <LanguageDropdown currentLanguage={state.selectedLanguage} />
              </div>
              <div class="my-4 block lg:hidden">
                <AutocompleteInput
                  direction={state.direction}
                  name="alternative"
                  options={searchOptions}
                  optionTemplate={(option) => (
                    <div class="flex-col">
                      <span class="flex">
                        {option.label}
                      </span>
                      <span
                        id="badge-dismiss-default"
                        class={option?.productType === "alternative"
                          ? renderAlternativeBadgeClasses()
                          : renderBoycottBadgeClasses()}
                      >
                        {option.productType === "alternative" ? "✔️" : "🚫"}
                      </span>
                    </div>
                  )}
                  handleSelect={(item) => {
                    setSelectedProduct(item);
                    window.location.href =
                      `/${item.productType}/${item.nameSlug}`;
                  }}
                  icon={
                    <span
                      class={getIconClass()}
                    >
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
                  }
                  placeholder={"search"}
                />
                <input hidden type="submit" />
              </div>
            </div>
          </form>
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
          {state.categories.map((category) =>
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
          )}
        </div>
      </div>
    </nav>
  );
};
