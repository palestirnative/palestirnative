import { useEffect, useMemo, useState } from "preact/hooks";

export default function AutocompleteInput(
  {
    name,
    options,
    optionTemplate,
    onChange,
  },
) {
  const [inputValue, setInputValue] = useState("");
  const [shouldShowOptions, setShouldShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const usedOptionTemplate = (option) => (
    optionTemplate ? optionTemplate(option) : <span>{option.label}</span>
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (!value) setFilteredOptions([]);
    else {setFilteredOptions(options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      ));}

    if (value.length > 0) {
      setShouldShowOptions(true);
    } else {
      setShouldShowOptions(false);
    }
  };

  useEffect(() => {
    onChange(inputValue);
  }, [inputValue]);

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    setShouldShowOptions(false);
  };

  return (
    <>
      <div class="my-2 w-full">
        <div class="w-full relative">
          <input
            type="text"
            name={name}
            id={name}
            value={inputValue}
            autocomplete="new-password"
            onKeyup={handleInputChange}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
          <div
            hidden={!shouldShowOptions}
            class="absolute z-10 left-0 w-full bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600"
          >
            {filteredOptions.map((option) => (
              <div
                class="py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOptionClick(option)}
              >
                {usedOptionTemplate(option)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
