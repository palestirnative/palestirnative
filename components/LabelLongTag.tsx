const labels = {
  A: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-400">
      <h2 class=" font-normal text-emerald-900">
        Label: A
      </h2>
    </div>
  ),
  B: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-400">
      <h2 class="font-normal text-yellow-900">
        Label: B
      </h2>
    </div>
  ),
  C: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-rose-400">
      <h2 class="font-normal text-rose-900">
        Label: C
      </h2>
    </div>
  ),
};

export default function LabelLongTag({ label } : { label: "A" | "B" | "C" }) {
  return labels[label];
}
