export default function FAQ({ state }) {
    return (
        <section class="bg-white dark:bg-gray-900 h-full">
    <div class="container px-6 py-12 mx-auto">
        <h1 class="text-2xl font-semibold text-gray-800 lg:text-3xl dark:text-white">{state.locale["Frequently asked questions"]}</h1>

        <div class="grid grid-cols-1 gap-8 mt-8 lg:mt-16 md:grid-cols-2 xl:grid-cols-3">
            <div>
                <div class="inline-block p-3 text-white bg-green-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div>
                    <h1 class="text-xl font-semibold text-gray-700 dark:text-white">{state.locale["FAQ Q1"]}</h1>

                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    {state.locale["FAQ A1"]}                    </p>
                </div>
            </div>

            <div>
                <div class="inline-block p-3 text-white bg-green-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div>
                    <h1 class="text-xl font-semibold text-gray-700 dark:text-white">{state.locale["FAQ Q2"]}</h1>

                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    {state.locale["FAQ A2"]} 
                    </p>
                </div>
            </div>

            <div>
                <div class="inline-block p-3 text-white bg-green-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div>
                    <h1 class="text-xl font-semibold text-gray-700 dark:text-white">{state.locale["FAQ Q3"]}</h1>

                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    {state.locale["FAQ A3"]} 
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
    )
}