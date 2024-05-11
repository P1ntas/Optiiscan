/**
 * Removes a toast element after a specified timeout.
 * @param {string} id - The id of the toast element to remove.
 */
function toastTimeout(id) {
	setTimeout(() => {
		document.getElementById(id)?.remove();
	}, 3000);
}

/**
 * @param {string} m - Message to show in the toast
 */
export const success = (m) => {
	const id = Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(2, 10);
	document.body.insertAdjacentHTML(
		'beforeend',
		`
    <div id="${id}" class="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-green-500 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 fixed bottom-5 right-5" role="alert">
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      </div>
      <div class="ps-4 text-sm font-normal text-white">${m}</div>
    </div>
    `
	);
	toastTimeout(id);
};

/**
 * @param {string} m - Message to show in the toast
 */
export const error = (m) => {
	const id = Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(2, 10);
	document.body.insertAdjacentHTML(
		'beforeend',
		`
    <div id="${id}" class="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-red-500 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 fixed bottom-5 right-5" role="alert">
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
      </div>
      <div class="ps-4 text-sm font-normal text-white">${m}</div>
    </div>
    `
	);
	toastTimeout(id);
};
