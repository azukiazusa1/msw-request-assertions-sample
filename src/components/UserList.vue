<script setup lang="ts">
import { useFetch } from "@vueuse/core";
import { watch } from "vue";

interface User {
  id: number;
  name: string;
}

const {
  isFetching,
  error,
  data: users,
} = useFetch<User[]>("/api/users").json();
</script>

<template>
  <div v-if="isFetching">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id" data-testid="user">
      {{ user.name }}
    </li>
  </ul>
</template>
