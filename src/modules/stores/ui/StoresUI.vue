<script lang="ts" setup>
import { Button, Modal, Space } from 'ant-design-vue';
import { DatabaseOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <Button type="default" :icon="h(DatabaseOutlined)" @click="isOpen = true" style="width: 100%">View
    Stores List</Button>
  <Modal title="Settings" v-model:open="isOpen">
    <Space direction="vertical" style="width: 100%; justify-content: space-between;">
      <div style="width: 100%;">
        <h3>Stores List</h3>
        <p>Stores list content goes here.</p>
      </div>
    </Space>
  </Modal>
</template>
