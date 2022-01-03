<template>
  <div class="row upload-box">
    <label>
      {{ title }}:
      <input type="file" @input="onInput" multiple />
    </label>
  </div>
  <div class="droptarget-wrap" v-if="drop">
    <div
      id="droptarget"
      ref="dropTarget"
      @drop="onDrop"
      @dragenter="onDrop"
      @dragover="onDrop"
    >
      把文件拖到此处
    </div>
  </div>
</template>

<script>
import useFile from "@/utils/file/useFile";

export default {
  props: ["title", "drop"],
  emits: ["onRead"],
  setup(props, ctx) {
    const { fileMetaList, onImportFiles, onDropFile } = useFile();

    const onInput = async (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.files) {
        await onImportFiles(target.files);
        ctx.emit("onRead", fileMetaList);
        // console.log(fileMetaList.value);
        // console.log(fileMetaList.value[0]?.content);
      }
    };

    const onDrop = async (event) => {
      const res = await onDropFile(event);
      if (res) {
        ctx.emit("onRead", fileMetaList);
      }
    };
    return { onDrop, onInput };
  }
};
</script>

<style scoped>
.droptarget-wrap {
  display: flex;
  height: 30vh;
  width: var(--td-main-width);
  margin-top: var(--td-btn-padding-top);
}
#droptarget {
  height: 80%;
  width: 100%;
  background: var(--td-gray-bg);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
