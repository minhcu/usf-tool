<script lang="ts" setup>
import { Button, Card, Space } from 'ant-design-vue';
import { UnlockOutlined, ExportOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';
import { loginUsf, previewCurrentTheme } from '@/modules/usf/shared'
import { notifyError } from '@/shared/error';

const loadingState = ref<Record<string, boolean>>({
  loginUsf: false,
  previewTheme: false
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
  <Card title="Usf features">
    <Space class="w-full" direction="vertical">
      <Button class="w-full" type="primary" :icon="h(UnlockOutlined)" @click="() => handleAction('loginUsf', loginUsf)">Login USF</Button>
      <Button class="w-full" type="primary" :icon="h(ExportOutlined)" @click="() => handleAction('previewTheme', previewCurrentTheme)">Preview Current Theme</Button>
    </Space>
  </Card>
</template>
