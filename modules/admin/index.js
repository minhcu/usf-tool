function loginAdmin(credentials) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            alert("No active tabs found.");
        }

        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId },
            args: [credentials],
            func: (credentials) => {
                const username = document.querySelector("#user");
                const password = document.querySelector("#password");
                const loginButton = document.querySelector("#btn");
                username.value = credentials.adminUsername;
                password.value = credentials.adminPassword;
                loginButton.click();
            },
        });
    });
};

function getStoreEmail(credentials, app) {
    let storeId = app.querySelector("#storeId").value;
    // TODO: validate storeId
    if (!storeId) {
        alert("Please enter a store URL.");
        return;
    }
    if (storeId.includes('-myshopify-com')) storeId = storeId.replace('-myshopify-com', '.myshopify.com')
    else if (storeId.includes('-mybigcommerce-com')) storeId = storeId.replace('-mybigcommerce-com', '.mybigcommerce.com')

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            alert("No active tabs found.");
        }

        const tabId = tabs[0].id;
        console.log(tabs[0])

        chrome.scripting.executeScript({
            target: { tabId },
            args: [storeId, credentials],
            func: async (storeId, credentials) => {
                try {
                    const response = await fetch(credentials.emailLookupUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            "__VIEWSTATE": document.querySelector("#__VIEWSTATE").value,
                            "__VIEWSTATEGENERATOR": document.querySelector("#__VIEWSTATEGENERATOR").value,
                            "__EVENTVALIDATION": document.querySelector("#__EVENTVALIDATION").value,
                            "txtSite": storeId,
                            "btnLookup": "Lookup emails",
                        }).toString()
                    })
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const emailEl = doc.querySelector("#lbl");
                    if (emailEl) {
                        const extractedEmail = emailEl.textContent.replace("Found emails: ", "").trim();
                        chrome.runtime.sendMessage({ type: "addStoreCredential", text: storeId + ':' + extractedEmail });
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
    })
};

export {
    loginAdmin,
    getStoreEmail,
};