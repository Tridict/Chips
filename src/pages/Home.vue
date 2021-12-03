<template>
  <SentenceBox />
  <SentenceBox />
  <SentenceBox />
  <bs-card />
</template>

<script>
import SentenceBox from "@/components/SentenceBox.vue";
import BsCard from '../components/bs/BsCard.vue';

export default {
  name: "Home",
  components: { SentenceBox, BsCard },
  setup() {
    return {};
  }
};
</script>

<style scoped></style>
