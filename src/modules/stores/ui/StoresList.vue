<script lang="ts" setup>
import { Button, Table, Popconfirm } from 'ant-design-vue';

withDefaults(defineProps<{
  columns?: Array<{
    title: string;
    dataIndex: string;
    key: string;
  }>;

  tableData?: Array<{
    key: string;
    storeId: string;
    email: string | undefined;
  }>;
}>(), {});

defineEmits<{
  (e: 'deleteStore', storeId: string): void;
}>();
</script>

<template>
  <Table :columns="columns" :data-source="tableData">
    <template #bodyCell="{ column, record }">
      <span v-if="column.dataIndex === 'operation'">
        <Popconfirm title="Are you sure to delete this store credential?" okText="Yes" cancelText="No"
          @confirm="$emit('deleteStore', record.storeId)">
          <Button type="link">Delete</Button>
        </Popconfirm>
      </span>
    </template>
  </Table>
</template>
