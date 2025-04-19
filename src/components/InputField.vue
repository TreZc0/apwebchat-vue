<script setup lang="ts">
  import { defineProps, defineModel } from 'vue'
  defineProps<{
    name: string
    label?: string
    placeholder?: string
  }>()
  const model = defineModel()
</script>

<template>
  <div class="chat-input-field">
    <label :for="name" v-if="label != null">{{label}}</label>
    <input :name="name" :placeholder="placeholder" v-model="model" />
  </div>
</template>

<style scoped>
  .chat-input-field {
    display: flex;
    align-items: center;
    flex-grow: 1;
    width: 100%;
  }
  input {
    flex-grow: 1;
    padding: 4px 4px 4px 0;
    margin: 4px 4px 4px 0;
    background-color: #1d1f21;
    color: #efefef;
    border: 2px solid #1d1f21;
    border-radius: 3px;
  }
  label {
    margin: 8px 4px 8px 0;
  }
</style>
