import { notifyError } from '@/shared/error'
import { useCredentialsStore, useStoreCredentialsStore } from '@/shared/store'

export async function openAdminTool() {
  const credentialsStore = useCredentialsStore()
  const url = credentialsStore.credentials.emailLookupUrl
  if (!url) {
    notifyError('Admin tool URL is not set')
    return
  }
  console.log('Opening admin tool at URL:', url)
  const [tab] = await chrome.tabs.query({
    url: url,
  })

  if (tab && tab.id) {
    chrome.tabs.update(tab.id, { active: true })
  } else {
    chrome.tabs.create({ url })
  }
}

export async function loginAdminTool() {
  const { credentials } = useCredentialsStore()
  const { adminUsername, adminPassword } = credentials

  if (!adminUsername || !adminPassword) {
    notifyError('Admin tool URL is not set')
    return
  }
  const [tab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  })

  if (!tab?.id) {
    notifyError('Admin tool tab not found. Please open the admin tool first.')
    return
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [adminUsername, adminPassword],
    func: (username: string, password: string) => {
      const usernameInput = document.querySelector<HTMLInputElement>('#user')
      const passwordInput = document.querySelector<HTMLInputElement>('#password')
      const loginButton = document.querySelector<HTMLButtonElement>('#btn')

      if (!usernameInput || !passwordInput || !loginButton) {
        alert(
          'Unable to find login form elements on the page. \nPlease make sure you are on the correct admin tool login page.',
        )
        return
      }

      usernameInput.value = username
      passwordInput.value = password
      loginButton.click()
    },
  })
}

export async function getStoreEmailFromUrl(url: string) {
  if (!url || !(url.includes('myshopify') || url.includes('bigcommerce'))) {
    notifyError('Store URL is invalid')
    return
  }
  const formattedUrl = url.includes('myshopify')
    ? url.replace('-myshopify-com', '.myshopify.com')
    : url.replace('-bigcommerce-com', '.bigcommerce.com')
  const storeCredentialsStore = useStoreCredentialsStore()

  const storeEmail = storeCredentialsStore.stores[formattedUrl]

  // TODO: change notifyError to notifySuccess and open usf app page for the store if user wants to
  if (storeEmail) {
    notifyError(`Store email found: ${storeEmail.split(',')[0]}`)
    return
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab || !tab.id || !tab.url) {
    notifyError('No active tab found')
    return
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [formattedUrl, tab.url],
    func: async (storeId: string, currentUrl: string) => {
      try {
        const __VIEWSTATE = document.querySelector<HTMLInputElement>('#__VIEWSTATE')?.value
        const __VIEWSTATEGENERATOR = document.querySelector<HTMLInputElement>('#__VIEWSTATEGENERATOR')?.value
        const __EVENTVALIDATION = document.querySelector<HTMLInputElement>('#__EVENTVALIDATION')?.value

        if (!__VIEWSTATE || !__VIEWSTATEGENERATOR || !__EVENTVALIDATION) {
          alert('Unable to find necessary form elements on the page')
          return
        }

        const response = await fetch(currentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            __VIEWSTATE,
            __VIEWSTATEGENERATOR,
            __EVENTVALIDATION,
            txtSite: storeId,
            btnLookup: 'Lookup emails',
          }).toString(),
        })
        const html = await response.text()
        const emailEl = (new DOMParser()).parseFromString(html, 'text/html').querySelector('#lbl')
        if (emailEl) {
          const extractedEmail = emailEl.textContent.replace('Found emails: ', '').trim()
          chrome.runtime.sendMessage({
            type: 'addStoreCredential',
            payload: storeId + ':' + extractedEmail,
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
  })
}
