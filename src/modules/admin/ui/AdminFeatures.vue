<script lang="ts" setup>
import { ExportOutlined, UnlockOutlined } from '@ant-design/icons-vue';
import { Button, Card, Input, Space } from 'ant-design-vue';
import { h, ref } from 'vue';
import { getStoreEmailFromUrl, loginAdminTool, openAdminTool } from '../shared';
import { notifyError } from '@/shared/error';

// TODO: the app open tab should remove the '*'

const email = ref('');
const loadingState = ref<Record<string, boolean>>({
  getStoreUrl: false,
  openAdmin: false,
  loginAdmin: false
});

async function handleAction(actionKey: string, callback: () => void | Promise<void>) {
  loadingState.value[actionKey] = true;
  try {
    await callback();
  } catch (error) {
    notifyError((error as Error).message);
  } finally {
    loadingState.value[actionKey] = false;
  }
}
</script>

<template>
  <Card title="Admin tool">
    <Space class="w-full" direction="vertical">
      <Space class="w-full" direction="vertical">
        <Input class="w-full" placeholder="Enter store URL" v-model:value="email" />
        <Button class="w-full mt-2" type="primary" :icon="h(ExportOutlined)"
          @click="handleAction('getStoreUrl', () => getStoreEmailFromUrl(email))"
          :loading="loadingState.getStoreUrl">Get Store Url</Button>
      </Space>

      <Space.Compact class="w-full">
        <Button class="w-full" type="primary" :icon="h(ExportOutlined)"
          @click="handleAction('openAdmin', openAdminTool)" :loading="loadingState.openAdmin">Open Admin Tool</Button>

        <Button class="w-full" type="primary" :icon="h(UnlockOutlined)"
          @click="handleAction('loginAdmin', loginAdminTool)" :loading="loadingState.loginAdmin">Login Admin
          Tool</Button>
      </Space.Compact>
    </Space>
  </Card>
</template>
