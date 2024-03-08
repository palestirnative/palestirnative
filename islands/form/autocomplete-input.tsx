import { useEffect, useState } from "preact/hooks";

export default function AutocompleteInput(
  {
    name,
    options,
    optionTemplate,
    onChange,
    placeholder = "",
    icon = null,
    direction = "ltr",
    handleSelect,
    withImage = true,
    customHeight = "md",
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
    onChange?.(inputValue);
  }, [inputValue]);

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    handleSelect(option);
    setShouldShowOptions(false);
  };

  const getImageClass = () => {
    const style = direction === "rtl"
      ? "h-5 w-5 rounded-full mr-4 object-contain"
      : "h-5 w-5 rounded-full ml-4 object-contain";
    return style;
  };

  const getContainerClass = () => {
    const style = customHeight === "md"
      ? "absolute z-10 left-0 w-full overflow-y-auto h-40 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600"
      : "absolute z-10 left-0 w-full overflow-y-auto h-20 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600";
    return style;
  };

  return (
    <>
      <div class="my-2 w-full">
        <div class="w-full relative">
          {icon}
          <input
            placeholder={placeholder}
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
            class={getContainerClass()}
          >
            {filteredOptions.map((option) => (
              <div
                class="flex flex-row items-center border-b border-b-gray-100  hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option.logoURL && withImage
                  ? (
                    <img
                      src={option.logoURL}
                      alt={option.name}
                      class={getImageClass()}
                    />
                  )
                  : null}
                <div class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {usedOptionTemplate?.(option)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
