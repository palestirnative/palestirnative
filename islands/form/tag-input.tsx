import { useMemo, useRef, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface HasLabel {
  label: string;
  logoURL?: string;
}

type TagInputProps<T extends HasLabel> = {
  name: string;
  tags: T[];
  handleSelect: (tag: T) => void;
  handleRemove: (tag: T) => void;
  options: T[];
  optionTemplate?: (tag: T) => JSX.Element;
  tagTemplate?: (tag: T) => JSX.Element;
  placeholder?: string;
  icon?: JSX.Element | null;
  withImage?: boolean;
  customHeight?: string;
};

export default function TagInput<T extends HasLabel>(
  {
    name,
    tags = [],
    handleSelect,
    handleRemove,
    options,
    optionTemplate,
    tagTemplate,
    placeholder = "",
    icon = null,
    withImage = true,
    customHeight = "md",
  }: TagInputProps<T>,
) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const usedOptionTemplate = (option: T) => (
    optionTemplate ? optionTemplate(option) : <span>{option.label}</span>
  );

  const usedTagTemplate = (tag: T) => (
    tagTemplate ? tagTemplate(tag) : <span>{tag.label}</span>
  );

  const handleInputChange = (event: Event) => {
    setInputValue((event.target as HTMLInputElement).value);
  };
  const shouldShowOptions = useMemo(() => {
    return isFocused || !!inputValue;
  }, [isFocused, inputValue]);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

  const handleOptionClick = (option: T) => {
    handleSelect(option);
    setInputValue("");
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const getContainerClass = () => {
    const style = customHeight === "md"
      ? "absolute z-10 start-0 w-full overflow-y-auto h-40 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600"
      : "absolute z-10 start-0 w-full overflow-y-auto h-20 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600";
    return style;
  };

  return (
    <>
      <div
        class="my-2"
        onMouseLeave={handleMouseLeave}
      >
        <div class="w-full relative">
          {icon && (
            <div class="absolute inset-y-0 start-0 ps-3 flex items-center">
              {icon}
            </div>
          )}
          <input
            type="text"
            name={name}
            id={name}
            placeholder={placeholder}
            value={inputValue}
            autocomplete="off"
            onKeyUp={handleInputChange}
            onFocus={handleInputFocus}
            ref={inputRef}
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
                      alt={option.label}
                      class="h-5 w-5 rounded-full ms-4 object-contain"
                    />
                  )
                  : null}
                <div class="py-2 px-4">
                  {usedOptionTemplate?.(option)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="w-full mt-2">
          {tags?.map((tag) => (
            <span
              id="badge-dismiss-default"
              class="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
            >
              {usedTagTemplate?.(tag)}
              <button
                type="button"
                class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                data-dismiss-target="#badge-dismiss-default"
                aria-label="Remove"
                onClick={() => handleRemove?.(tag)}
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
