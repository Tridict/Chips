<template>
  <SentenceBox
    :title="sentence.text"
    :content="sentence"
    v-for="sentence in sentenceList"
    :key="sentence.id"
    @submit="addAnnotation"
  />
</template>

<script>
import { ref } from "vue";
import SentenceBox from "@/components/SentenceBox.vue";

export default {
  name: "Home",
  components: { SentenceBox },
  setup() {
    const sentenceList = ref([
      {
        id: 0,
        text: "这是第一句的内容，算是body部分。一个字符串...",
        annotations: []
      },
      {
        id: 1,
        text: "一个字符串",
        annotations: []
      }
    ]);

    const addAnnotation = (pars) => {
      if (sentenceList.value[pars.id]?.annotations) {
        sentenceList.value[pars.id].annotations.push(pars.annotation);
        console.log(sentenceList.value);
      } else {
        console.log('没有找到对应的句子')
        console.log(pars);
      }
    };
    return { sentenceList, addAnnotation };
  }
};
</script>

<style scoped></style>
