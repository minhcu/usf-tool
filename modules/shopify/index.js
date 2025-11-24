function getStoreUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length === 0) {
            alert("No active tabs found.");
        }

        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: () => {
                if (window.Shopify && window.Shopify.shop)
                    navigator.clipboard.writeText(window.Shopify.shop)
            }
        });


    })
}

export {
    getStoreUrl,
};