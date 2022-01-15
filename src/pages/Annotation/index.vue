<template>
  <div class="card my-3">
    <div class="card-body">
      <div class="row mb-2">
        <div class="col">
          <UploadBox
            title="导入需要标注的文件"
            :drop="true"
            @onRead="onReadAnnotation"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <DownloadBtn
            filename="annotation.json"
            :content="JSON.stringify(sentenceList, null, 2)"
            btnText="导出annotation"
          />
        </div>
      </div>
    </div>
  </div>
  <SentenceBox
    v-for="sentence in sentenceList"
    :key="sentence.id"
    :title="sentence.text"
    :content="sentence"
    v-show="sentence.text"
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
