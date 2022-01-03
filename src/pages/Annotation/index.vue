<template>
  <UploadBox title="导入annotation" :drop="true" @onRead="onReadAnnotation" />
  <DownloadBtn
    filename="annotation.json"
    :content="sentenceList"
    btnText="导出annotation"
  />
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
import UploadBox from "../../components/uploadBox.vue";
import DownloadBtn from "../../components/downloadBtn.vue";

export default {
  components: { SentenceBox, UploadBox, DownloadBtn },
  setup() {
    const sentenceList = inject("sentenceList");
    const onReadAnnotation = inject("onReadAnnotation");
    return { sentenceList, onReadAnnotation };
  }
};
</script>

<style scoped></style>
