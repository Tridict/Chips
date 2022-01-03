<template>
  <UploadBox title="导入schema" @onRead="onImport" />
  <DownloadBtn filename="schema.json" :content="schema" btnText="导出schema" />
  <!-- 文本区域 -->
  <div class="edit-area col-12 col-xl-6">
    <div class="container my-2 py-2 border border-eee rounded">
      <div class="row my-1">
        <div class="col">
          <textarea
            v-model="textarea"
            rows="10"
            class="form-control"
          ></textarea>
          <button
            type="button"
            class="btn btn-success btn-sm m-1"
            @click="onReset"
          >
            重置
          </button>
          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="onUpdate"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";
import UploadBox from "../../components/uploadBox.vue";
import DownloadBtn from "../../components/downloadBtn.vue";

export default {
  components: { UploadBox, DownloadBtn },
  setup() {
    const schema = inject("schema");
    const updateSchema = inject("updateSchema");
    const textarea = ref(schema.value);
    const onReset = () => {
      textarea.value = schema.value;
    };
    const onUpdate = () => {
      updateSchema(textarea.value);
    };
    const onImport = (fileContents) => {
      const content = fileContents.value[0]?.content;
      updateSchema(content);
    };
    watch(schema, () => {
      textarea.value = schema.value;
    });
    return { schema, textarea, onReset, onUpdate, onImport };
  }
};
</script>

<style></style>
