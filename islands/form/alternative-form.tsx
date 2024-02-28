import TagInput from "./tag-input.tsx";
import { ArrowUpTraySolid } from "https://esm.sh/preact-heroicons";
import { useMemo, useState } from "preact/hooks";
import countries from "../../utils/countries.ts";

const indexedCountries = countries.reduce((acc, item) => ({
  ...acc,
  [item.code.toLowerCase()]: item.name,
}), {});

const countryOptionTemplate = (country) => (
  <div class="flex items-center">
    <img
      src={`/flags/${country.value}.svg`}
      alt={`${country.label} flag`}
      class="w-4 h-4 mr-2 rounded-full"
    />
    <span>{country.label}</span>
  </div>
);

const boycottOptionTemplate = (boycott) => (
  <div class="flex items-center">
    <img
      src={boycott.logoURL}
      alt={`${boycott.label} logo`}
      class="w-4 h-4 mr-2 rounded-full"
    />
    <span>{boycott.label}</span>
  </div>
);

export default function AlternativeForm({ boycotts, state }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoSource, setLogoSource] = useState(null);

  const submitURL = useMemo(() => {
    return "/alternative";
  }, []);

  const submitMethod = useMemo(() => {
    return "POST";
  }, []);

  const [selectedCountries, setSelectedCountries] = useState([]);

  const [countryOptions, setCountryOptions] = useState(
    countries.map((country) => ({
      value: country.code.toLowerCase(),
      label: country.name,
    })).filter((option) => !selectedCountries.includes(option)),
  );

  const handleSelectCountry = (country) => {
    setSelectedCountries([...selectedCountries, country]);
    setCountryOptions(
      countryOptions.filter((option) => option.value !== country.value),
    );
  };

  const handleUnselectCountry = (country) => {
    setCountryOptions([...countryOptions, country]);
    setSelectedCountries(
      selectedCountries.filter((option) => option.value !== country.value),
    );
  };

  const [selectedBoycotts, setSelectedBoycotts] = useState([]);

  const [boycottOptions, setBoycottOptions] = useState(
    boycotts.map((boycott) => ({
      value: boycott._id,
      label: boycott.name,
      logoURL: boycott.logoURL,
    })),
  );

  const handleSelectBoycott = (boycott) => {
    setSelectedBoycotts([...selectedBoycotts, boycott]);
    setBoycottOptions(
      boycottOptions.filter((option) => option.value !== boycott.value),
    );
  };

  const handleUnselectBoycott = (boycott) => {
    setBoycottOptions([...boycottOptions, boycott]);
    setSelectedBoycotts(
      selectedBoycotts.filter((option) => option.value !== boycott.value),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.target);

    const countries = selectedCountries.map((country) => country.value).join(
      ",",
    );
    formData.append("countries", countries);

    const boycotts = selectedBoycotts.map((boycott) => boycott.value).join(",");
    formData.append("boycotts", boycotts);

    const response = await fetch(submitURL, {
      method: submitMethod,
      body: formData,
    });

    setIsLoading(false);

    if (!response.ok) {
      if (response.status === 500) {
        setError("Something went wrong. Please try again later.");
      } else {
        setError(await response.text());
      }
    } else {
      window.location.href = "/alternative";
    }
  };

  const handleLogoChange = (event) => {
    const logo = event.target.files[0];

    if (logo) {
      setLogoSource(URL.createObjectURL(logo));
    }
  };

  return (
    <>
      {error && (
        <div class="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >
        <div class="my-2 flex flex-col items-center">
          <img
            hidden={!logoSource}
            src={logoSource}
            alt="Logo"
            class="w-32 h-32 my-2 rounded-full"
          />
          <label
            class="cursor-pointer flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
            for="logo"
          >
            <ArrowUpTraySolid class="w-5 h-5" />
            {logoSource
              ? state.locale["Change logo"]
              : state.locale["Set a logo"]}
          </label>

          <input
            type="file"
            id="logo"
            accept="image/*"
            name="logo"
            onChange={handleLogoChange}
            hidden
          />
        </div>

        <div class="grid grid-cols-1 gap-6 my-4 sm:grid-cols-2">
          <div>
            <label class="text-gray-700 dark:text-gray-200" for="name">
              {state.locale["Name"]}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label class="text-gray-700 dark:text-gray-200" for="website">
              {state.locale["Website"]}
            </label>
            <input
              id="website"
              name="website"
              type="url"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
        </div>

        <div>
          <label class="text-gray-700 dark:text-gray-200" for="categories">
            {state.locale["Countries"]}
          </label>
          <TagInput
            name="countriesInput"
            tags={selectedCountries}
            handleSelect={handleSelectCountry}
            options={countryOptions}
            handleRemove={handleUnselectCountry}
            optionTemplate={countryOptionTemplate}
            tagTemplate={countryOptionTemplate}
          />
        </div>

        <div>
          <label class="text-gray-700 dark:text-gray-200" for="categories">
            {state.locale["Boycotts"]}
          </label>
          <TagInput
            name="boycottsInput"
            tags={selectedBoycotts}
            handleSelect={handleSelectBoycott}
            options={boycottOptions}
            handleRemove={handleUnselectBoycott}
            optionTemplate={boycottOptionTemplate}
            tagTemplate={boycottOptionTemplate}
          />
        </div>

        <div class="flex justify-end mt-6">
          <button
            disabled={isLoading}
            class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            {isLoading ? state.locale["Submitting..."] : state.locale["Submit"]}
          </button>
        </div>
      </form>
    </>
  );
}
