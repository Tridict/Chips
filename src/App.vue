<template>
  <NavBar />
  <main class="container">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="tab == TABS.annotation ? 'active':''" href="#" @click="tab = TABS.annotation">标注</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="tab == TABS.schema ? 'active':''" href="#" @click="tab = TABS.schema">管理 Schema</a>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled">Disabled</a>
      </li>-->
    </ul>

    <Home v-if="tab == TABS.annotation" />
  </main>
</template>

<script>
import { ref } from "vue";
import Home from "@/pages/Home.vue";
import NavBar from "@/components/NavBar.vue";

const TABS = {
  annotation: Symbol(),
  schema: Symbol(),
}

export default {
  components: { Home, NavBar },
  name: "App",
  setup() {
    const tab = ref(TABS.annotation);
    return { tab, TABS };
  },
};
</script>
