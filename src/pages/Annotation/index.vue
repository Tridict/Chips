<template>
  <div class="card my-3">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <UploadBox
            title="导入需要标注的文件"
            :drop="false"
            @onRead="onReadAnnotation"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="card my-3">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <DownloadBtn
            filename="annotation.json"
            :content="JSON.stringify(sentenceList, null, 2)"
            btnText="导出"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="card my-3">
    <div class="card-body">
      <!-- <PageControl @start="onStart"></PageControl> -->
      <PageControl></PageControl>
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
import PageControl from "../../components/PageControl.vue";

export default {
  components: { SentenceBox, UploadBox, DownloadBtn, PageControl },
  setup() {
    const sentenceList = inject("sentenceList");
    const onReadAnnotation = inject("onReadAnnotation");
    // const onStart = (start) => {};
    return { sentenceList, onReadAnnotation };
  },
};
</script>

<style scoped></style>
