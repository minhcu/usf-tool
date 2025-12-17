import { useCredentialsStore, useStoreCredentialsStore } from '@/shared/store'

export async function loginUsf() {
  const { credentials } = useCredentialsStore()
  const { stores } = useStoreCredentialsStore()
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  if (!tab?.id || !tab.url) throw new Error('USF app tab not found. Please open the USF app first.')

  const isStaging = credentials.usfStagingAppUrl.includes(window.location.hostname)
  const password = isStaging ? credentials.usfStagingPassword : credentials.usfPassword

  let username: string | undefined
  if (isStaging) {
    username = credentials.usfStagingUsername
  } else {
    const storeId = new URL(tab.url).pathname
      .split('/')[1]
      ?.replace('-myshopify-com', '.myshopify.com')
      .replace('-mybigcommerce-com', '.mybigcommerce.com')
    if (
      !storeId ||
      (!storeId.includes('.myshopify.com') && !storeId.includes('.mybigcommerce.com'))
    )
      throw new Error('Current tab is not a valid USF app page')

    username = stores[storeId]?.split(',')[0]
  }

  if (!username) throw new Error(`No stored credentials found`)

  const [response] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [username, password],
    func: (username: string, password: string) => {
      const usernameInput = document.querySelector<HTMLInputElement>('[name="Username"]')
      const passwordInput = document.querySelector<HTMLInputElement>('[name="Password"]')
      const loginButton = document.querySelector<HTMLButtonElement>('button')

      if (!usernameInput || !passwordInput || !loginButton) {
        return {
          ok: false,
          payload:
            'Unable to find login form elements on the page. Please make sure you are on the correct USF app login page.',
        }
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

  if (response?.result?.ok === false) throw new Error(response.result.payload)
}
