export async function openNewOrExistedTab(url: string) {
  if (!url) throw new Error('URL pattern is empty')

  const [tab] = await chrome.tabs.query({
    url,
  })

  if (tab && tab.id) chrome.tabs.update(tab.id, { active: true })
  else chrome.tabs.create({ url })
}
