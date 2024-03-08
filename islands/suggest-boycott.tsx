import { useMemo, useState } from "preact/hooks";
import AutocompleteInput from "./form/autocomplete-input.tsx";

export default function SuggestAlternative({ boycotts, state, alternative }) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [selectedBoycott, setSelectedBoycott] = useState(null);
  const [forceHide, setForceHide] = useState(false);

  const boycottsOptions = useMemo(() => {
    const alternativeBoycottsIds = alternative.boycotts.map((boycott) =>
      boycott._id
    );

    return boycotts.filter((boycott) =>
      !alternativeBoycottsIds.includes(boycott._id.toString())
    ).map((boycott) => ({
      label: boycott.name,
      value: boycott.name,
      logoURL: boycott.logoURL,
    }));
  }, [boycotts]);

  const showModal = () => {
    setShouldShowModal(true);
  };

  const hideModal = (event) => {
    event.preventDefault();
    setShouldShowModal(false);
  };

  const onChange = (value) => {
    setSelectedBoycott(null);
    const found = boycotts.find((b) => b.name === value);
    if (found) {
      setSelectedBoycott(found);
    }
  };

  return (
    <>
      <button
        onClick={showModal}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {state.locale["Suggest an alternative"]}
      </button>
      <div
        hidden={!shouldShowModal}
        class="fixed inset-0 z-10 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div class="relative inline-block p-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:max-w-sm rounded-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:p-6">
            <div class="mt-5 text-center">
              <h3
                class="text-lg font-medium text-gray-800 dark:text-white"
                id="modal-title"
              >
                {state.locale["Enter the alternative name"]}
              </h3>
            </div>

            <div class="flex items-center justify-between w-full mt-5 gap-x-2">
              <AutocompleteInput
                name="alternative"
                options={boycottsOptions}
                onChange={onChange}
                customHeight="sm"
                handleSelect={() => setForceHide(true)}
                forceHide={forceHide}
              />
            </div>

            <form
              action={`/boycott/${selectedBoycott?._id}/suggestAlternative`}
              method="POST"
              class="mt-4 sm:flex sm:items-center sm:justify-between sm:mt-6 sm:-mx-2"
            >
              <input hidden value={alternative.nameSlug} name="alternative" />
              <button
                onClick={hideModal}
                class="px-4 sm:mx-2 w-full py-2.5 text-sm font-medium dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
              >
                Cancel
              </button>

              <button class="px-4 sm:mx-2 w-full py-2.5 mt-3 sm:mt-0 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
