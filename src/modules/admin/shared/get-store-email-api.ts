import { openNewOrExistedTab } from '@/shared/chrome-api'
import { useCredentialsStore, useStoreCredentialsStore } from '@/shared/store'

async function fetchStoreEmailAsync(storeId: string, currentUrl: string) {
  try {
    const __VIEWSTATE = document.querySelector<HTMLInputElement>('#__VIEWSTATE')?.value
    const __VIEWSTATEGENERATOR =
      document.querySelector<HTMLInputElement>('#__VIEWSTATEGENERATOR')?.value
    const __EVENTVALIDATION = document.querySelector<HTMLInputElement>('#__EVENTVALIDATION')?.value

    if (!__VIEWSTATE || !__VIEWSTATEGENERATOR || !__EVENTVALIDATION)
      throw new Error('Unable to find necessary form elements on the page')

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
    const html = new DOMParser()
      .parseFromString(await response.text(), 'text/html')

    const emailEl = html?.querySelector<HTMLElement>('[action*="EmailsLookup"] #lbl')
    if (!emailEl)
      throw new Error(
        'An error occurred while fetching the store email. Please try to refresh the page and lookup again.',
      )

    const extractedEmail = emailEl.textContent.replace('Found emails: ', '').trim()
    chrome.runtime.sendMessage({
      type: 'addStoreCredential',
      payload: storeId + ':' + extractedEmail,
    })

    return { ok: true, payload: extractedEmail }
  } catch (err) {
    return { ok: false, payload: err instanceof Error ? err.message : String(err) }
  }
}

export async function getStoreEmailFromUrl(url: string) {
  if (!url || !(url.includes('myshopify') || url.includes('bigcommerce')))
    throw new Error('Invalid store URL provided')

  const formattedUrl = url.includes('myshopify')
    ? url.replace('-myshopify-com', '.myshopify.com')
    : url.replace('-mybigcommerce-com', '.mybigcommerce.com')

  const storeCredentialsStore = useStoreCredentialsStore()
  const credentialsStore = useCredentialsStore()

  const storeEmail = storeCredentialsStore.stores[formattedUrl]
  if (storeEmail) {
    openNewOrExistedTab(
      credentialsStore.credentials.usfAppUrl + formattedUrl.replace(/\./g, '-') + '/*',
    )
    return
  }

  const [emailTab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (
    !emailTab ||
    !emailTab.id ||
    !emailTab.url ||
    emailTab.url !== credentialsStore.credentials.emailLookupUrl
  ) {
    openNewOrExistedTab(credentialsStore.credentials.emailLookupUrl)
    return
  }

  const [response] = await chrome.scripting.executeScript({
    target: { tabId: emailTab.id },
    args: [formattedUrl, emailTab.url],
    func: fetchStoreEmailAsync,
  })

  if (response?.result?.ok === false) throw new Error(response.result.payload)

  openNewOrExistedTab(
    credentialsStore.credentials.usfAppUrl + formattedUrl.replace(/\./g, '-') + '/*',
  )
}
