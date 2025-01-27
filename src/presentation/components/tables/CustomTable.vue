<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  idAttribute: string;
  columns: {
    field: string;
    label: string;
    formatter: Function | null;
    onClick: Function | null;
    style?: string | null;
  }[];
  data: any[];
}>();
</script>

<template>
  <table class="table table-striped">
    <!-- En-tête -->
    <thead>
    <tr>
      <th
        v-for="(column, index) in columns"
        :key="column.field"
        :style="index === 0 || index === columns.length - 1 ? 'width: 50px;' : ''">
        {{ column.label }}
      </th>
    </tr>
    </thead>

    <!-- Corps -->
    <tbody>
    <tr v-for="item in data" :key="item[idAttribute]">
      <td
        v-for="(column, index) in columns"
        :key="column.field"
        :style="index === 0 || index === columns.length - 1 ? 'width: 50px;' : column.style || ''"
        @click="column.onClick ? column.onClick(item) : () => {}">
          <span :class="{ clickable: column.onClick }">
            <!-- Vérifie si un formatter est utilisé -->
            <template v-if="column.formatter">
              <span v-html="column.formatter(item)"></span>
            </template>
            <template v-else>
              {{ item[column.field] }}
            </template>
          </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

/* Les colonnes de largeur fixe */
.table th:nth-child(1),
.table th:last-child,
.table td:nth-child(1),
.table td:last-child {
  width: 50px !important;
  text-align: center;
}
</style>
