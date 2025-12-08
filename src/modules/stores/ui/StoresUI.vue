<script lang="ts" setup>
import { Button, Modal, Space } from 'ant-design-vue';
import { DatabaseOutlined } from '@ant-design/icons-vue';
import { computed, h, ref } from 'vue';
import { useStoreCredentialsStore } from '@/shared/store';
import StoresImport from './StoresImport.vue';
import StoresList from './StoresList.vue';

const isOpen = ref(false);

const storesCredentials = useStoreCredentialsStore();

const columns = [
  {
    title: 'Store ID',
    dataIndex: 'storeId',
    key: 'storeId',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    key: 'operation',
  },
];
const tableData = computed(() => {
  const list = storesCredentials.stores;

  return Object.keys(list).map((store) => ({
    key: store,
    storeId: store,
    email: list[store]
  }))
});
</script>

<template>
  <Button type="default" :icon="h(DatabaseOutlined)" @click="isOpen = true" style="width: 100%">View
    Stores List</Button>
  <Modal title="Settings" v-model:open="isOpen" width="500">
    <Space class="w-full" direction="vertical">
      <StoresImport />

      <StoresList :columns="columns" :tableData="tableData" @deleteStore="storesCredentials.deleteStore" />
    </Space>
  </Modal>
</template>
