<template>
  <SentenceBox />
  <SentenceBox />
  <SentenceBox />
</template>

<script>
import SentenceBox from "@/components/SentenceBox.vue";

export default {
  name: "Home",
  components: { SentenceBox },
  setup() {
    return {};
  },
}
</script>

<style scoped></style>
