/**
 * Load UMD script from the back and execute it.
 * @param {string} url
 * @return {Promise}
 */
export async function loadUmd(url) {
    return new Promise((resolve, reject) => {
        // Create a script element
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
    });
}

/**
 * Load CSS script from the back and add it to the DOM.
 * @param url
 * @return {Promise}
 */
export async function loadCss(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = (error) => reject(error);
        document.head.appendChild(link);
    });
}