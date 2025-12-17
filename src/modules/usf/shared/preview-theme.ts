import { useCredentialsStore } from '@/shared/store'

export async function previewCurrentTheme() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: useCredentialsStore().credentials.usfAppUrl + '*',
  })
  if (!tab || !tab.url) throw new Error('Current tab is not a valid SHOPIFY USF app page')

  const parsedUrl = new URL(tab.url)
  const storeId = parsedUrl.pathname.split('/')[1]
  if (!storeId || !storeId.includes('-myshopify-com'))
    throw new Error('Current tab is not a valid SHOPIFY USF app page')

  const hashParams = new URLSearchParams(parsedUrl.hash.slice(1))
  const themeId = hashParams.get('themeid')
  const storeName = storeId.replace('-myshopify-com', '.myshopify.com')
  const url = `https://${storeName}/collections/all?preview_theme_id=${themeId || ''}`

  await chrome.tabs.create({ url })
}
