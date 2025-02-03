<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import archipelagoIcon from '@/assets/archipelago.svg'
</script>

<template>
  <div class="wrapper">
    <header>
        <div class="title">
          <img class="logo" :src="archipelagoIcon" width="64px" height="64px" />
          <h2>APWebChat</h2>
        </div>
        <nav>
          <RouterLink activeClass="active-link" to="/">Chat</RouterLink>
          <RouterLink activeClass="active-link" to="/settings">Settings</RouterLink>
          <RouterLink activeClass="active-link" to="/about">About</RouterLink>
        </nav>
    </header>
    <main>
    <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header nav {
  display: flex;
}
.wrapper {
  max-width: 768px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 4px;
  background-color: #2d2f31;
  color: #efefef;
  border-radius: 4px;
}

.title {
  margin: 8px 12px 4px 8px;
  display: flex;
}

.logo {
  padding: 0px 12px 0px 0px;
}

nav a {
  padding: 8px;
  margin: 4px;
  color: #efefef;
  border-radius: 4px;
  transition: 0.1s;
}
.active-link, .active-link:hover {
  background-color: #4d4f51;
}
nav a:link, nav a:visited {
  text-decoration: none;
}
nav a:hover {
  background-color: #3d3f41;
}
main {
  margin-top: 8px;
}

@media only screen and (max-width: 768px) {
  header {
    flex-direction: column;
  }
}
</style>
