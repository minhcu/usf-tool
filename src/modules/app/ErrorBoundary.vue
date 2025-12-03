<script lang="ts" setup>
import { contextHolder } from '../../shared/error';
</script>

<template>
  <slot />
  <contextHolder />
</template>
