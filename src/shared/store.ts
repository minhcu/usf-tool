import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export type Credentials = {
  adminUsername: string
  adminPassword: string
  usfPassword: string
  stagingUsfPassword: string
  emailLookupUrl: string
  usfAppUrl: string
}
export const useCredentialsStore = defineStore('credentials', () => {
  const credentials = reactive<Credentials>({
    adminUsername: '',
    adminPassword: '',
    usfPassword: '',
    stagingUsfPassword: '',
    emailLookupUrl: '',
    usfAppUrl: '',
  })

  chrome.storage.local.get('credentials', (result: { credentials?: typeof credentials }) => {
    if (!result.credentials) return
    ;(Object.keys(result.credentials) as Array<keyof typeof credentials>).forEach((key) => {
      credentials[key] = result.credentials![key]
    })
  })

  function updateCredentials() {
    chrome.storage.local.set({ credentials })
  }

  return {
    credentials,
    updateCredentials,
  }
});

export type StoreCredentials = Record<string, string>
export const useStoreCredentialsStore = defineStore('storeCredentials', () => {
  const storeCredentials = ref<StoreCredentials>({})

  chrome.storage.local.get('storeCredentials', (result: { storeCredentials?: StoreCredentials }) => {
    if (!result.storeCredentials) return
    Object.assign(storeCredentials, result.storeCredentials)
  })

  function updateStoreCredentials() {
    chrome.storage.local.set({ storeCredentials })
  }

  return {
    storeCredentials,
    updateStoreCredentials,
  }
})
