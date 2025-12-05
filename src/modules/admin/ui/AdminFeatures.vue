<script lang="ts" setup>
import { ExportOutlined, UnlockOutlined } from '@ant-design/icons-vue';
import { Button, Card, Input, Space } from 'ant-design-vue';
import { h, ref } from 'vue';
import { getStoreEmailFromUrl, loginAdminTool, openAdminTool } from '../shared/api';

const email = ref('');
</script>

<template>
  <Card title="Admin tool">
    <Space class="w-full" direction="vertical">
      <Space class="w-full" direction="vertical">
        <Input class="w-full" placeholder="Enter store URL" v-model:value="email" />
        <Button class="w-full mt-2" type="primary" :icon="h(ExportOutlined)" @click="getStoreEmailFromUrl(email)">Get Store Url</Button>
      </Space>
      <Space.Compact class="w-full">
        <Button class="w-full" type="primary" :icon="h(ExportOutlined)" @click="openAdminTool">Open Admin Tool</Button>
        <Button class="w-full" type="primary" :icon="h(UnlockOutlined)" @click="loginAdminTool">Login Admin Tool</Button>
      </Space.Compact>
    </Space>
  </Card>
</template>
