<script lang="ts" setup>
import { notifySuccess } from '@/shared/error';
import { useStoreCredentialsStore } from '@/shared/store';
import { Button, Modal, Space, Textarea } from 'ant-design-vue';
import { ref } from 'vue';

const storesCredentials = useStoreCredentialsStore();
const isOpen = ref(false);
const importData = ref('');

function ok() {
  storesCredentials.importFromJson(importData.value);
  isOpen.value = false;
  notifySuccess('Imported stores successfully!');
}
</script>

<template>
  <Space>
    <Button type="primary" @click="isOpen = true">Import (JSON)</Button>
    <Modal title="Import stores (JSON)" v-model:open="isOpen" @ok="ok">
      <Textarea style="width: 100%; height: 300px;" v-model:value="importData" />
    </Modal>
    <Button type="primary" @click="storesCredentials.exportToJson">Export (JSON)</Button>
  </Space>
</template>
