<template>
  <SentenceBox
    v-for="sentence in sentenceList"
    :key="sentence.id"
    :title="sentence.text"
    :content="sentence"
  />
</template>

<script>
import { inject } from "vue";
import SentenceBox from "./components/SentenceBox.vue";

export default {
  components: { SentenceBox },
  setup() {
    const sentenceList = inject("sentenceList");
    return { sentenceList };
  }
};
</script>

<style scoped></style>
