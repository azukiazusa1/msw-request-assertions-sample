<script lang="ts" setup>
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
}

const users = ref<User[]>([]);
const query = ref("");

const url = computed(() => {
  if (query.value) {
    return `/api/users?q=${query.value}`;
  } else {
    return "/api/users";
  }
});

const fetchUsers = async () => {
  const response = await fetch(url.value);
  const data = await response.json();
  users.value = data;
};
</script>

<template>
  <form @submit.prevent>
    <label for="query">Search</label>
    <input type="text" id="query" v-model="query" />
    <button type="submit" @click="fetchUsers">Fetch</button>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </form>
</template>
