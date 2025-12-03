import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export type Credentials = {
  emailLookupUrl: string
  adminUsername: string
  adminPassword: string
  usfAppUrl: string
  usfPassword: string
  usfStagingAppUrl: string
  usfStagingPassword: string
  usfStagingUsername: string
}
export const useCredentialsStore = defineStore('credentials', () => {
  const credentials = reactive<Credentials>({
    emailLookupUrl: '',
    adminUsername: '',
    adminPassword: '',

    usfAppUrl: '',
    usfPassword: '',

    usfStagingAppUrl: '',
    usfStagingUsername: '',
    usfStagingPassword: '',
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
  const stores = ref<StoreCredentials>({})

  chrome.storage.local.get('storeCredentials', (result: { storeCredentials?: StoreCredentials }) => {
    if (!result.storeCredentials) return
    stores.value = result.storeCredentials
  })

  function updateStoreCredentials() {
    chrome.storage.local.set({ storeCredentials: stores.value })
  }

  return {
    stores,
    updateStoreCredentials,
  }
})
