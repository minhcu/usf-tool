<script lang="ts" setup>
import { Button, Modal, Space, Input } from 'ant-design-vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';
import { useCredentialsStore } from '@/shared/store';

const isOpen = ref(false);
const credentialsStore = useCredentialsStore();

function saveCredentials() {
  credentialsStore.updateCredentials();
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
          <Input placeholder="Email Lookup URL" type="text" v-model:value="credentialsStore.credentials.emailLookupUrl" />
          <Input placeholder="Admin Tool username" type="text" v-model:value="credentialsStore.credentials.adminUsername" />
          <Input placeholder="Admin Tool password" type="password" v-model:value="credentialsStore.credentials.adminPassword" />
        </Space>
      </div>

      <div style="width: 100%;">
        <h3>USF</h3>
        <Space direction="vertical">
          <Input placeholder="USF App URL" type="text" v-model:value="credentialsStore.credentials.usfAppUrl" />
          <Input placeholder="USF password" type="password" v-model:value="credentialsStore.credentials.usfPassword" />
          <Input placeholder="Staging USF password" type="password" v-model:value="credentialsStore.credentials.usfStagingPassword" />
        </Space>
      </div>
    </Space>
  </Modal>
</template>
