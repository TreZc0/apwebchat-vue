<template>
  <div class="spinner">
  </div>
</template>

<style scoped>
.spinner {
  height: 24px;
  width: 24px;
  margin: 8px;
  background-color: #efefef;
  animation: spin 1.5s ease-out infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(380deg);
  }
  60% {
    transform: rotate(355deg);
  }
  80%, 100% {
    transform: rotate(360deg);
  }
}
</style>
