import { useMemo, useState } from "preact/hooks";
import AutocompleteInput from "./form/autocomplete-input.tsx";
import { Boycott } from "../types/boycott.ts";
import { AppState } from "../routes/_middleware.ts";
import { Alternative } from "../types/alternative.ts";

export default function SuggestAlternative({ boycott, state, alternatives }: {
  boycott: Boycott;
  state: AppState;
  alternatives: Alternative[];
}) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [forceHide, setForceHide] = useState(false);

  const alternativesOptions = useMemo(() => {
    const boycottAlternativeIds = boycott.alternatives.map((alternative : Record<string, string>) =>
      alternative.alternative.toString()
    );

    return alternatives.filter((alternative) =>
      !boycottAlternativeIds.includes(alternative._id.toString())
    ).map((alternative) => ({
      label: alternative.name,
      value: alternative.name,
      logoURL: alternative.logoURL,
    }));
  }, [alternatives]);

  const showModal = () => {
    setShouldShowModal(true);
  };

  const hideModal = (event: Event) => {
    event.preventDefault();
    setShouldShowModal(false);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch(`/boycott/${boycott._id}/suggestAlternative`, {
      method: "POST",
      body: formData,
    }).then((res) => {
      window.location.reload();
    }).catch();
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
        <form
          action={`/boycott/${boycott._id}/suggestAlternative`}
          method="POST"
          class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
          onSubmit={handleSubmit}
        >
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
                options={alternativesOptions}
                customHeight="sm"
                handleSelect={() => setForceHide(true)}
                forceHide={forceHide}
              />
            </div>

            <div class="mt-4 sm:flex sm:items-center sm:justify-between sm:mt-6 sm:-mx-2">
              <button
                onClick={hideModal}
                class="px-4 sm:mx-2 w-full py-2.5 text-sm font-medium dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
              >
                Cancel
              </button>

              <button class="px-4 sm:mx-2 w-full py-2.5 mt-3 sm:mt-0 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
