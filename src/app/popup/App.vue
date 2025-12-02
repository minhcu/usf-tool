<script setup lang="ts">
import { Layout, LayoutHeader, LayoutContent, LayoutFooter, Card, Space } from 'ant-design-vue';
import CredentialsPopup from '@/modules/credentials/ui/CredentialsPopup.vue';
import AdminFeatures from '@/modules/admin/ui/AdminFeatures.vue';
import UsfFeatures from '@/modules/usf/ui/UsfFeatures.vue';
import ShopifyFeatures from '@/modules/shopify/ui/ShopifyFeatures.vue';
import StoresUI from '@/modules/stores/ui/StoresUI.vue';
</script>

<template>
  <Layout>
    <LayoutHeader style="color: #fff; text-align: center;">
      <h2>Popup Header</h2>
    </LayoutHeader>
    <LayoutContent style="padding: 25px 50px 0 50px;">
      <Card>
        <Space direction="vertical" style="width: 100%;">
          <CredentialsPopup />

          <StoresUI />

          <UsfFeatures />

          <AdminFeatures />

          <ShopifyFeatures />
        </Space>
      </Card>
    </LayoutContent>
    <LayoutFooter style="text-align: center;">
      <a href="https://github.com/minhcu" target="_blank">github.com/minhcu©2024</a>
    </LayoutFooter>
  </Layout>
</template>

<style scoped></style>
