import { useCredentialsStore } from '@/shared/store'

export async function loginAdminTool() {
  const { adminUsername, adminPassword } = useCredentialsStore().credentials

  if (!adminUsername || !adminPassword) throw new Error('Admin credentials are not set')

  const [tab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  })

  if (!tab?.id) throw new Error('Admin tool tab not found. Please open the admin tool first.')

  const [response] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [adminUsername, adminPassword],
    func: (username: string, password: string) => {
      const usernameInput = document.querySelector<HTMLInputElement>('#user')
      const passwordInput = document.querySelector<HTMLInputElement>('#password')
      const loginButton = document.querySelector<HTMLButtonElement>('#btn')

      if (!usernameInput || !passwordInput || !loginButton) {
        return {
          ok: false,
          payload:
            'Unable to find login form elements on the page. Please make sure you are on the correct admin tool login page.',
        }
      }

      usernameInput.value = username
      passwordInput.value = password
      loginButton.click()

      return {
        ok: true,
        payload: 'Login form submitted successfully',
      }
    },
  })

  if (response?.result?.ok === false) throw new Error(response.result.payload)
}
