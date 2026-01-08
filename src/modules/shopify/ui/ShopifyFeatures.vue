<script lang="ts" setup>
import { notifyError, notifySuccess } from '@/shared/error';
import { useCredentialsStore } from '@/shared/store';
import { CopyTwoTone, ExportOutlined } from '@ant-design/icons-vue';
import { Button, Card, Flex, Input, Space, Tag } from 'ant-design-vue';
import { computed, h, ref } from 'vue';

// TODO: auto add preview password for password protected stores

declare global {
  interface Window {
    Shopify: {
      shop: string
      theme: {
        name: string
        id: number
        role: string
      }
    }

    _usfTheme: {
      assetUrl: string
      id: number
      name: string
      version: string
      vendor: string
    }
  }
}

const Shopify = ref<Window['Shopify'] | undefined>(undefined)
const _usfTheme = ref<Window['_usfTheme'] | undefined>(undefined)

async function fetchShopifyData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) return

  const [response] = await chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      world: 'MAIN', // 👈 page context
      func: () => ({
        Shopify: window.Shopify,
        _usfTheme: window._usfTheme
      }),
    }
  )

  if (!response?.result) return

  const { Shopify: shopifyData, _usfTheme: usfThemeData } = response.result
  if (shopifyData) Shopify.value = shopifyData
  if (usfThemeData) _usfTheme.value = usfThemeData
}


const storeUrl = computed(() => {
  if (Shopify.value) return Shopify.value.shop

  if (_usfTheme.value && _usfTheme.value.assetUrl.includes('.mybigcommerce.com')) {
    const url = new URL(_usfTheme.value.assetUrl)
    return url.pathname.split('/')[1] as string
  }

  return ''
})

const shopifyThemeName = computed(() => Shopify.value?.theme?.name || '')

const usfInstalled = computed(() => _usfTheme.value)
const installedLabel = computed(() => {
  if (!Shopify.value) return 'Not Shopify store'

  return usfInstalled.value ? `USF is installed - Theme: ${_usfTheme.value?.name} (v${_usfTheme.value?.version})` : 'USF is not installed'
})

fetchShopifyData()

async function copyToClipboard(text: string) {
  try {
    if (!text) throw new Error('No value to copy')

    await navigator.clipboard.writeText(text)

    notifySuccess('Copied to clipboard')
  } catch (err) {
    notifyError((err as Error).message)
  }
}

const credentialsStore = useCredentialsStore()

function openUsfApp() {
  try {
    if (!credentialsStore.credentials?.usfAppUrl) throw new Error('Missing USF App URL in credentials')

    const shopDomain = Shopify.value?.shop.replace(/\./g, '-')
    const url = `${credentialsStore.credentials.usfAppUrl}/${shopDomain}`

    chrome.tabs.create({ url })
  }
  catch (err) {
    notifyError((err as Error).message)
  }
}

function openUsfCustomization() {
  try {
    if (!_usfTheme.value) throw new Error('USF is not installed on this theme')
    if (!credentialsStore.credentials?.usfAppUrl) throw new Error('Missing USF App URL in credentials')

    const shopDomain = Shopify.value?.shop.replace(/\./g, '-')
    const baseUrl = `${credentialsStore.credentials.usfAppUrl}/${shopDomain}#/customization`

    const params = new URLSearchParams({
      name: _usfTheme.value.name,
      themeid: _usfTheme.value.id.toString(),
      themename: Shopify.value?.theme?.name || '',
      themeversion: Shopify.value?.theme?.id.toString() || ''
    })

    const url = `${baseUrl}?${params.toString()}`

    chrome.tabs.create({ url })
  }
  catch (err) {
    notifyError((err as Error).message)
  }
}
</script>

<template>
  <Card title="Shopify tool">
    <Space class="w-full" direction="vertical">
      <Flex justify="space-between" align="center" :gap="5" class="w-full">
        <div class="no-wrap">Shop:</div>
        <Input class="w-full cursor-pointer" readonly :disabled="!storeUrl" :value="storeUrl"
          @click="copyToClipboard(storeUrl)">
          <template #suffix>
            <CopyTwoTone />
          </template>
        </Input>
      </Flex>

      <Flex justify="space-between" align="center" :gap="5" class="w-full">
        <div class="no-wrap">Theme name:</div>
        <Input class="w-full cursor-pointer" readonly :disabled="!shopifyThemeName" :value="shopifyThemeName"
          @click="copyToClipboard(shopifyThemeName)">
          <template #suffix>
            <CopyTwoTone />
          </template>
        </Input>
      </Flex>

      <Tag :color="usfInstalled ? 'green' : 'red'" class="w-full text-center">
        {{ installedLabel }}
      </Tag>

      <Space v-if="Shopify" class="w-full" direction="vertical" justify="center">
        <Button class="w-full" type="primary" :icon="h(ExportOutlined)" @click="openUsfApp">Open USF App</Button>
      </Space>

      <Space v-if="usfInstalled" class="w-full" direction="vertical" justify="center">
        <Button class="w-full" type="primary" :icon="h(ExportOutlined)" @click="openUsfCustomization">Open Theme Customization</Button>
      </Space>
    </Space>
  </Card>
</template>
