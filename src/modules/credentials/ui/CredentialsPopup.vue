<script lang="ts" setup>
import { Button, Modal, Space, Input } from 'ant-design-vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import { h, reactive, ref } from 'vue';

const isOpen = ref(false);
const credentials = reactive({
  adminUsername: '',
  adminPassword: '',
  usfPassword: '',
  stagingUsfPassword: '',
  emailLookupUrl: '',
  usfAppUrl: '',
});

chrome.storage.local.get("credentials", (result: { credentials?: typeof credentials }) => {
  if (!result.credentials) return;
  (Object.keys(result.credentials) as Array<keyof typeof credentials>).forEach((key) => {
    credentials[key] = result.credentials![key];
  });
});

function saveCredentials() {
  chrome.storage.local.set({ credentials });
  isOpen.value = false;
}
</script>

<template>
  <Button type="default" :icon="h(SettingOutlined)" @click="isOpen = true" style="width: 100%">Setup
    Credentials</Button>
  <Modal title="Credentials" v-model:open="isOpen" @ok="saveCredentials">
    <Space style="width: 100%; justify-content: space-between;">
      <div style="width: 100%;">
        <h3>Admin Tool</h3>
        <Space direction="vertical">
          <Input placeholder="Email Lookup URL" type="text" v-model:value="credentials.emailLookupUrl" />
          <Input placeholder="Admin Tool username" type="text" v-model:value="credentials.adminUsername" />
          <Input placeholder="Admin Tool password" type="password" v-model:value="credentials.adminPassword" />
        </Space>
      </div>

      <div style="width: 100%;">
        <h3>USF</h3>
        <Space direction="vertical">
          <Input placeholder="USF App URL" type="text" v-model:value="credentials.usfAppUrl" />
          <Input placeholder="USF password" type="password" v-model:value="credentials.usfPassword" />
          <Input placeholder="Staging USF password" type="password" v-model:value="credentials.stagingUsfPassword" />
        </Space>
      </div>
    </Space>
  </Modal>
</template>
