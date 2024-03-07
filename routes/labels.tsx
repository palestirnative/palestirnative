import { AppState } from "./_middleware.ts";

export default function Labels({ state }: { state: AppState }) {
  return (
    <div class="container mx-auto my-20">
      <div class="flex flex-col gap-10 w-1/2 mx-auto">
        <div class="flex px-10 py-4 rounded-lg shadow gap-6 bg-emerald-400">
          <h2 class="text-4xl rounded-lg font-normal text-emerald-900 p-10 border border-emerald-900">
            A
          </h2>
          <p>
            {state.locale["Label A"]}
          </p>
        </div>
        <div class="flex px-10 py-4 rounded-lg shadow gap-6 bg-yellow-400">
          <h2 class="text-4xl rounded-lg font-normal text-yellow-900 p-10 border border-yellow-900">
            B
          </h2>
          <p>
            {state.locale["Label B"]}
          </p>
        </div>
        <div class="flex px-10 py-4 rounded-lg shadow gap-6 bg-rose-400">
          <h2 class="text-4xl rounded-lg font-normal text-rose-900 p-10 border border-rose-900">
            C
          </h2>
          <p>
            {state.locale["Label C"]}
          </p>
        </div>
      </div>
    </div>
  );
}
