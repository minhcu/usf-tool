<script lang="ts" setup>
import { Button, Card, Space } from 'ant-design-vue';
import { UnlockOutlined, ExportOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import { loginUsf, previewCurrentTheme } from '@/modules/usf/shared/api'
</script>

<template>
  <Card title="Usf features">
    <Space class="w-full" direction="vertical">
      <Button class="w-full" type="primary" :icon="h(UnlockOutlined)" @click="loginUsf">Login USF</Button>
      <Button class="w-full" type="primary" :icon="h(ExportOutlined)" @click="previewCurrentTheme">Preview Current Theme</Button>
    </Space>
  </Card>
</template>
