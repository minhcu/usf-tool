import { loginAdmin, getStoreEmail } from './modules/admin/index.js';
import { loginUsf, previewCurrentTheme } from './modules/usf/index.js';
import { getStoreUrl } from './modules/shopify/index.js';

const SELECTOR = {
    APP: "#app",
    NAV_HEADING: "nav h1",
    NAV_BUTTON: "nav button",
    BUTTON: "button[data-view]",
    VIEW: "#app > [data-view]",
    HOME_VIEW: "home",
};

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector(SELECTOR.APP);
    const { ref, watch, reactive } = VueReactivity;

    const view = ref("home");
    const credentials = reactive({
        adminUsername: '',
        adminPassword: '',
        usfPassword: '',
        stagingUsfPassword: '',
        emailLookupUrl: '',
        usfAppUrl: '',
    });
    const storeCredentials = ref({})

    chrome.storage.local.get("storeCredentials", (result) => {
        if (result.storeCredentials) {
            storeCredentials.value = result.storeCredentials;
        }
    });

    watch(storeCredentials, (newVal) => {
        chrome.storage.local.set({ storeCredentials: newVal });
        const storeList = app.querySelector("#storeList");
        storeList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Store URL</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(newVal).map(key => {
            return `<tr>
                        <td>${key}</td>
                        <td>${newVal[key]}</td>
                    </tr>`
        }).join('')}
            </tbody>
        </table>
        `
    });

    watch(view, (newVal) => {
        document.querySelectorAll(SELECTOR.VIEW).forEach(element => {
            element.style.display = element.getAttribute("data-view") === newVal ? "block" : "none";
        });

        app.querySelector(SELECTOR.NAV_HEADING).textContent = newVal;

        if (newVal === SELECTOR.HOME_VIEW) {
            app.querySelector(SELECTOR.NAV_BUTTON).style.display = "none";
        }
        else {
            app.querySelector(SELECTOR.NAV_BUTTON).style.display = "block";
        };
    });

    document.querySelectorAll(SELECTOR.NAV_BUTTON).forEach(button => {
        button.addEventListener("click", () => {
            view.value = SELECTOR.HOME_VIEW;
        });
    });
    document.querySelectorAll("button[data-view]").forEach(button => {
        button.addEventListener("click", () => {
            view.value = button.getAttribute("data-view");
        });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "addStoreCredential") {
            const [url, email] = message.text.split(":")
            storeCredentials.value = {
                ...storeCredentials.value,
                [url]: email
            }

            setTimeout(() => {
                chrome.tabs.create({
                    url: credentials.usfAppUrl + url.split(".").join('-'),
                })
            })
        }
    });

    chrome.storage.local.get("credentials", (result) => {
        if (result.credentials) {
            Object.keys(credentials).forEach(key => {
                credentials[key] = result.credentials[key];
            });
        }
    });

    // Dynamic watchers and event listeners for v-model bindings
    Object.keys(credentials).forEach(key => {
        const input = document.querySelector(`[v-model="${key}"]`);
        input.addEventListener("input", () => {
            credentials[key] = input.value;
        });
        watch(credentials, (newVal) => {
            input.value = newVal[key];
        });
    });


    app.addEventListener("click", (event) => {
        if (event.target.matches("[data-action='save']")) {
            chrome.storage.local.set({ credentials });
        }
        if (event.target.matches("[data-action='loginAdmin']")) {
            loginAdmin(credentials);
        }
        if (event.target.matches("[data-action='getStoreEmail']")) {
            getStoreEmail(credentials, app);
        }
        if (event.target.matches("[data-action='loginUsf']")) {
            loginUsf(credentials, storeCredentials);
        }
        if (event.target.matches("[data-action='previewCurrentTheme']")) {
            previewCurrentTheme();
        }
        if (event.target.matches("[data-action='getStoreUrl']")) {
            getStoreUrl();
        }

        if (event.target.matches("[data-action='getStoreList']")) {
            const storeList = JSON.stringify(storeCredentials.value, null, 2);
            navigator.clipboard.writeText(storeList).then(() => {
                alert("Store list copied to clipboard!");
            });
        }
    });
});