const labels = {
  A: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-400 text-sm">
      <h2 class="text-sm font-normal text-emerald-900">
        A
      </h2>
    </div>
  ),
  B: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-400 text-sm">
      <h2 class="text-sm font-normal text-yellow-900">
        B
      </h2>
    </div>
  ),
  C: (
    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-rose-400 text-sm">
      <h2 class="text-sm font-normal text-rose-900">
        C
      </h2>
    </div>
  ),
};

export default function LabelTag({ label }) {
  return labels[label];
}
