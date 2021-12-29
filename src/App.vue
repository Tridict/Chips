<template>
  <NavBar />
  <main class="container">
    <Home />
  </main>
</template>

<script>
import Home from "@/pages/Home.vue";
import NavBar from "@/components/NavBar.vue";
export default {
  components: { Home, NavBar },
  name: "App"
};
</script>
