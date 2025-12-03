import { notifyError } from '@/shared/error'
import {
  useCredentialsStore,
  useStoreCredentialsStore,
} from '@/shared/store'

export async function loginUsf() {
  const { credentials } = useCredentialsStore()
  const { stores } = useStoreCredentialsStore()
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  if (!tab?.id || !tab.url) {
    notifyError('No active tab found')
    return
  }

  const isStaging = credentials.usfStagingAppUrl.includes(window.location.hostname)
  const password = isStaging ? credentials.usfStagingPassword : credentials.usfPassword

  let username: string | undefined
  if (isStaging) {
    username = credentials.usfStagingUsername
  } else {
    const storeId = new URL(tab.url).pathname.split('/')[1]
    if (!storeId?.includes('-myshopify-com')) {
      notifyError('Current tab is not a valid USF app page')
      return
    }

    username = stores[storeId.replace('-myshopify-com', '.myshopify.com')]?.split(',')[0]
    if (!username) {
      notifyError('No store email found for this store')
      return
    }
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [username, password],
    func: (username: string, password: string) => {
      const usernameInput = document.querySelector<HTMLInputElement>('[name="Username"]')
      const passwordInput = document.querySelector<HTMLInputElement>('[name="Password"]')
      const loginButton = document.querySelector<HTMLButtonElement>('button')

      if (!usernameInput || !passwordInput || !loginButton) {
        alert('Unable to find login form elements on the page')
        return
      }

      const setInputValue = (input: HTMLInputElement, value: string) => {
        input.value = value
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }

      setInputValue(usernameInput, username)
      setInputValue(passwordInput, password)
      loginButton.click()
    },
  })
}

export async function previewCurrentTheme() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab || !tab.url) {
    notifyError('No active tab found')
    return
  }

  const parsedUrl = new URL(tab.url)
  const storeId = parsedUrl.pathname.split('/')[1]
  if (!storeId || !storeId.includes('-myshopify-com')) {
    notifyError('Current tab is not a valid USF app page')
    return
  }

  const hashParams = new URLSearchParams(parsedUrl.hash.slice(1))
  const themeId = hashParams.get('themeid')
  const storeName = storeId.replace('-myshopify-com', '.myshopify.com')
  const url = `https://${storeName}/collections/all?preview_theme_id=${themeId || ''}`

  chrome.tabs.create({ url })
}
