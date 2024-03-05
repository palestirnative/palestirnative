import { useMemo, useState } from "preact/hooks";
import { createURL } from "../../utils/create-url.ts";
import countries from "../../utils/countries.ts";

export default function CountryDropdown({ state }) {
  const {
    locale: { countries: localeCountries },
    search,
    category,
    pathname,
  } = state;

  const currentCountry = useMemo(() => {
    return state.country || "all";
  }, [state.country]);

  const [shouldShow, setShouldShow] = useState(false);

  const toggleDropdown = () => {
    setShouldShow(!shouldShow);
  };

  const unfilteredOptions = useMemo(() => {
    const all = { name: localeCountries.All, code: "all" };
    return [all, ...countries];
  }, []);

  const options = useMemo(() => {
    return unfilteredOptions.filter((country) =>
      country.code !== currentCountry
    );
  }, [unfilteredOptions, currentCountry]);

  const currentOption = useMemo(() => {
    return unfilteredOptions.find((country) => country.code === currentCountry);
  }, [currentCountry, unfilteredOptions]);

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
        {currentOption?.code !== "all" && (
          <img
            src={`/flags/${currentOption.code.toLowerCase()}.svg`}
            alt={`${currentOption.name} flag`}
            class="w-4 h-4 mr-2 rounded-full"
          />
        )}

        {currentOption?.name}
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
          {options.map((country) => (
            <li>
              <a
                href={createURL(
                  { pathname, category, search },
                  country.code,
                )}
                class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {country.code !== "all" && (
                  <img
                    class="w-6 h-6 me-2 rounded-full"
                    src={`/flags/${country.code.toLowerCase()}.svg`}
                    alt={country.name}
                  />
                )}
                <span>{country.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
