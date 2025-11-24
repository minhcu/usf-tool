
function loginUsf(credentials, storeCredentials) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            alert("No active tabs found.");
        }

        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId },
            args: [credentials, storeCredentials.value],
            func: (credentials, storeCredentials) => {
                const isStaging = window.location.hostname.includes("staging");
                const username = document.querySelector('[name="Username"]');
                if (isStaging) {
                    username.value = 'support@sobooster.com'
                    username.dispatchEvent(new Event('input'), { bubbles: true });
                }
                else if (!username.value) {
                    const storeSegment = window.location.pathname.split("/")[1];
                    const storeEmail = storeCredentials[storeSegment.replace("-myshopify-com", ".myshopify.com")];
                    if (!storeEmail) {
                        alert("No store email found. Please get the store email first.");
                        return;
                    }
                    username.value = storeEmail.split(',')[0];
                    username.dispatchEvent(new Event('input'), { bubbles: true });
                }
                const password = document.querySelector('[name="Password"]');
                password.value = isStaging ? credentials.stagingUsfPassword : credentials.usfPassword;
                password.dispatchEvent(new Event('input'), { bubbles: true });

                const loginButton = document.querySelector('button');
                loginButton.click();
            },
        });
    });
}

function previewCurrentTheme() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            alert("No active tabs found.");
        }

        const parsedUrl = new window.URL(tabs[0].url);
        const storeSegment = parsedUrl.pathname.split("/")[1];
        const hashParams = new URLSearchParams(parsedUrl.hash.split("?")[1]);
        const themeId = hashParams.get("themeid");
        const storeName = storeSegment.replace("-myshopify-com", ".myshopify.com");
        const previewURL = `https://${storeName}/collections/all${themeId ? `?preview_theme_id=${themeId}` : ''}`;

        chrome.tabs.create({ url: previewURL });
    });
}

export {
    loginUsf,
    previewCurrentTheme,
};