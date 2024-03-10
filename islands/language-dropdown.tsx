import { useMemo, useState } from "preact/hooks";
import { languages } from "../locales/index.ts";
import { createLanguageURL } from "../utils/create-url.ts";
import { AppState } from "../routes/_middleware.ts";

export default function LanguageDropdown({ currentLanguage, state }: {
  currentLanguage: string;
  state: AppState;
}) {
  const [shouldShow, setShouldShow] = useState(false);

  const toggleDropdown = () => {
    setShouldShow(!shouldShow);
  };

  const currentLanguageName = useMemo(() => {
    return languages.find((language) => language.code === currentLanguage)
      ?.name;
  }, [currentLanguage]);

  const options = useMemo(() => {
    return languages.filter((language) => language.code !== currentLanguage)
      .sort(
        (a, b) => {
          return a.code.localeCompare(b.code);
        },
      );
  }, [currentLanguage]);

  return (
    <div class="relative">
      <button
        id="dropdownUsersButton"
        data-dropdown-toggle="dropdownUsers"
        data-dropdown-placement="bottom"
        class="text-gray-800 border-b hover:border-b-gray-500 focus:outline-none active:outline-none font-medium text-sm px-5 py-2.5 text-center inline-flex items-center"
        type="button"
        onClick={toggleDropdown}
      >
        {currentLanguageName}
        <svg
          class="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        hidden={!shouldShow}
        id="dropdownUsers"
        class="z-10 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700"
      >
        <ul
          class="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownUsersButton"
        >
          {options.map((language) => (
            <li>
              <div
                onClick={() => createLanguageURL(language.code, state)}
                class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              >
                <span>{language.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
