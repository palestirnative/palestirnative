import { AlternativeStatus } from "../types/boycott.ts";
import LabelTag from "./LabelTag.tsx";

export default function AlternativesGrid({ alternatives, state }) {
  return (
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {alternatives.map((alternative) => (
        <a
          href={`/alternative/${alternative.nameSlug}`}
          class="relative flex flex-col bg-white rounded-xl shadow hover:bg-gray-100 cursor-pointer items-center border-x border border-gray-200 px-4 py-2 w-80 h-80 my-2"
          style={{
            opacity: alternative.status === AlternativeStatus.Pending ? 0.5 : 1,
          }}
        >
          {alternative.status === AlternativeStatus.Pending && (
            <span class="absolute top-2 left-2 text-xs text-gray-700">
              {state.locale["Waiting for approval"]}
            </span>
          )}
          <div class="absolute top-2 right-2">
            {<LabelTag label={alternative.label} />}
          </div>
          <img
            src={alternative.logoURL}
            alt={alternative.name}
            class="h-36 rounded-full mb-2 mt-6"
          />
          <span class="font-medium text-2xl">
            {alternative.name}
          </span>
          <div class="flex my-2">
          {alternative.countries.slice(0, 3).map((country) => (
                            <img
                              src={`/flags/${country}.svg`}
                              alt={`${country} flag`}
                              class="w-6 h-6 mx-1 rounded-full"
                            />
                          ))}
                          {alternative.countries.length > 3 && (
                            <span class="text-gray-400">...</span>
                          )}
          </div>
          <div class="flex my-2">
            {alternative.boycotts?.length > 0 && (
              <>
                {state.locale["Alternative to"]} {alternative.boycotts.length}
              </>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
