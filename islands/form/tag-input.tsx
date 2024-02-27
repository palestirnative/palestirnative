import { useMemo, useState } from "preact/hooks";

export default function TagInput(
  { name, tags, handleSelect, handleRemove, options, optionTemplate, tagTemplate },
) {
  const [inputValue, setInputValue] = useState("");

  const usedOptionTemplate = (option) => (
    optionTemplate
      ? optionTemplate(option)
      : <span>{option.label}</span> 
  )

  const usedTagTemplate = (tag) => (
    tagTemplate
      ? tagTemplate(tag)
      : <span>{tag.label}</span> 
  )

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const shouldShowOptions = useMemo(() => {
    return !!inputValue;
  }, [inputValue]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return [];
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

  const handleOptionClick = (option) => {
    handleSelect(option);
    setInputValue("");
  };

  return (
    <>
      <div class="my-2">
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
        <div class="w-full mt-2">
          {tags.map((tag) => (
            <span
              id="badge-dismiss-default"
              class="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
            >
              {usedTagTemplate(tag)}
              <button
                type="button"
                class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                data-dismiss-target="#badge-dismiss-default"
                aria-label="Remove"
                onClick={() => handleRemove(tag)}
              >
                <svg
                  class="w-2 h-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Remove badge</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
