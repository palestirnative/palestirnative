import TagInput from "./tag-input.tsx";
import { ArrowUpTraySolid } from "https://esm.sh/preact-heroicons";
import { useMemo, useState } from "preact/hooks";
import Toastify from "toastify";
import { translate } from "../../utils/translation.ts";
import { JSX } from "preact/jsx-runtime";
import countries from "../../utils/countries.ts";

export type CountryOption = {
  value: string;
  label: string;
};

const categoryTemplate = (category) => (
  <span>
    {category.icon} {category.label}
  </span>
);

export default function BoycottForm(
  { categories, alternatives, state },
) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoSource, setLogoSource] = useState(null);

  const submitURL = useMemo(() => {
    return "/boycott";
  }, []);

  const submitMethod = useMemo(() => {
    return "POST";
  }, []);

  const [selectedCountries, setSelectedCountries] = useState<CountryOption[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(
    categories.map((category) => ({
      value: category._id,
      label: category.name,
      icon: category.icon,
    })),
  );
  const [countryOptions, setCountryOptions] = useState(
    countries
      .map((country) => ({
        value: country.code.toLowerCase(),
        label: country.name,
      }))
      .filter((option) => !selectedCountries.includes(option)),
  );

  const handleSelectCategory = (category) => {
    setSelectedCategories([...selectedCategories, category]);
    setCategoryOptions(
      categoryOptions.filter((option) => option.value !== category.value),
    );
  };

  const handleUnselectCategory = (category) => {
    setCategoryOptions([...categoryOptions, category]);
    setSelectedCategories(
      selectedCategories.filter((option) => option.value !== category.value),
    );
  };

  const [selectedAlternatives, setSelectedAlternatives] = useState([]);
  const [alternativeOptions, setAlternativeOptions] = useState(
    alternatives.map((alternative) => ({
      value: alternative._id,
      label: alternative.name,
      logoURL: alternative.logoURL,
    })),
  );

  const handleSelectAlternative = (alternative) => {
    setSelectedAlternatives([...selectedAlternatives, alternative]);
    setAlternativeOptions(
      alternativeOptions.filter((option) => option.value !== alternative.value),
    );
  };

  const handleUnselectAlternative = (alternative) => {
    setAlternativeOptions([...alternativeOptions, alternative]);
    setSelectedAlternatives(
      selectedAlternatives.filter(
        (option) => option.value !== alternative.value,
      ),
    );
  };

  const handleResetForm = () => {
    setSelectedCountries([]);
    setSelectedCategories([]);
    setLogoSource(null);
    setError(null);
    setSelectedAlternatives([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.target);

    const countries = selectedCountries
      .map((country) => country.value)
      .join(",");
    formData.append("countries", countries);
    const categoryIds = selectedCategories
      .map((category) => category.value)
      .join(",");
    const alternativeIds = selectedAlternatives
      .map((alternative) => alternative.value)
      .join(",");

    formData.append("categories", categoryIds);
    formData.append("alternatives", alternativeIds);

    const response = await fetch(submitURL, {
      method: submitMethod,
      body: formData,
    }).then(() => {
      setIsLoading(false);
      Toastify({
        text: translate(
          "ThankYouForSubmission",
          state.selectedLanguage,
          state.defaultLanguage,
        ),
        duration: 12000,
        newWindow: false,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "toastify-success",
        onClick: () => window.location.reload(),
      }).showToast();
      handleResetForm();
      window.location.reload();
    });

    if (!response.ok) {
      if (response.status === 500) {
        setError("Something went wrong. Please try again later.");
      } else {
        setError(await response.text());
      }
    }
  };

  const handleLogoChange = (event) => {
    const logo = event.target.files[0];

    if (logo) {
      setLogoSource(URL.createObjectURL(logo));
    }
  };

  const handleSelectCountry = (country: CountryOption) => {
    setSelectedCountries([...selectedCountries, country]);
    setCountryOptions(
      countryOptions.filter((option) => option.value !== country.value),
    );
  };

  const handleUnselectCountry = (country: CountryOption) => {
    setCountryOptions([...countryOptions, country]);
    setSelectedCountries(
      selectedCountries.filter((option) => option.value !== country.value),
    );
  };

  const countryOptionTemplate = (country: CountryOption): JSX.Element => (
    <div class="flex items-center">
      <img
        src={`/flags/${country.value}.svg`}
        alt={`${country.label} flag`}
        class="w-4 h-4 me-2 rounded-full"
      />
      <span>{country.label}</span>
    </div>
  );

  return (
    <>
      <p>
      </p>
      {error && (
        <div class="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div class="my-2 flex flex-col items-center">
          <img
            hidden={!logoSource}
            src={logoSource}
            alt="Logo"
            class="w-32 h-32 my-2 rounded-full object-contain"
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

        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
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
            <label class="text-gray-700 dark:text-gray-200" for="reasonurl">
              {state.locale["Reason URL"]}
            </label>
            <input
              id="reasonurl"
              name="reasonurl"
              type="url"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label class="text-gray-700 dark:text-gray-200" for="categories">
              {state.locale["Categories"]}
            </label>
            <TagInput
              name="categoriesInput"
              tags={selectedCategories}
              handleSelect={handleSelectCategory}
              options={categoryOptions}
              handleRemove={handleUnselectCategory}
              optionTemplate={categoryTemplate}
              tagTemplate={categoryTemplate}
            />
          </div>

          <div>
            <label class="text-gray-700 dark:text-gray-200" for="categories">
              {state.locale["Countries"]}
            </label>
            <TagInput<CountryOption>
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
            <label class="text-gray-700 dark:text-gray-200" for="alternatives">
              {state.locale["Alternatives"]}
            </label>
            <TagInput
              name="alternativesInput"
              tags={selectedAlternatives}
              handleSelect={handleSelectAlternative}
              options={alternativeOptions}
              handleRemove={handleUnselectAlternative}
            />
          </div>
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
