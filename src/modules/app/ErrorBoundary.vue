<script lang="ts" setup>
import { useStoreCredentialsStore } from '@/shared/store';
import { contextHolder, notifyError } from '../../shared/error';

const storeCredentialsStore = useStoreCredentialsStore();
chrome.runtime.onMessage.addListener((message: {
  type: string;
  payload: string;
}) => {
  switch (message.type) {
    case "addStoreCredential":
      const [url, email] = message.payload.split(":")
      if (!url || !email || !email.includes('@')) {
        notifyError('Received invalid store credential data');
        return;
      }

      storeCredentialsStore.stores = {
        ...storeCredentialsStore.stores,
        [url]: email
      }

      storeCredentialsStore.updateStoreCredentials();

      break;
    default:
      notifyError('Unknown message type received in ErrorBoundary');
      return;
  }
});
</script>

<template>
  <slot />
  <contextHolder />
</template>
