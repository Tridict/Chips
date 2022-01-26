<template>
  <div class="card my-3">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <UploadBox title="导入schema" @onRead="onImport" />
        </div>
      </div>
    </div>
  </div>
  <div class="card my-3">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <DownloadBtn
            filename="schema.json"
            :content="JSON.stringify(JSON.parse(schema), null, 2)"
            btnText="导出schema"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- 文本区域 -->
  <div class="edit-area col-12">
    <div class="container my-2 py-2 border border-eee rounded">
      <div class="row my-1">
        <div class="col">
          <div class="json-editor" ref="jecontainer"></div>
          <!-- <textarea
            v-model="textarea"
            rows="10"
            class="form-control"
          ></textarea> -->
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
import { inject } from "vue";
import UploadBox from "../../components/uploadBox.vue";
import DownloadBtn from "../../components/downloadBtn.vue";
import { useJsonEditor } from "@/utils/jsonEditor";

export default {
  components: { UploadBox, DownloadBtn },
  setup() {
    const schema = inject("schema");
    const updateSchema = inject("updateSchema");
    // const textarea = ref(schema.value);
    const { jecontainer, getJeVal, setJeVal } = useJsonEditor(schema, {
      modes: ["form", "code", "tree", "view"],
    });

    const onImport = fileContents => {
      const content = fileContents.value[0]?.content;
      updateSchema(content);
    };

    const onReset = () => {
      // textarea.value = schema.value;
      setJeVal(schema.value);
    };
    const onUpdate = () => {
      // updateSchema(textarea.value);
      updateSchema(getJeVal());
    };

    return { schema, jecontainer, onReset, onUpdate, onImport };
  },
};
</script>

<style>
.json-editor {
  height: 90vh;
}
.jsoneditor {
  border-color: #78acd9;
}
.jsoneditor-menu {
  background-color: #78acd9;
  border-color: #577bb5;
}
div.jsoneditor-object,
div.jsoneditor-array {
  display: none;
}
</style>
