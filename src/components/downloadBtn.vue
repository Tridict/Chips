<template>
  <!-- 导出 -->
  <button
    type="button"
    class="btn btn-primary btn-sm"
    @click="download(content, filename)"
  >
    {{ btnText }}
  </button>
</template>

<script>
import { saveAs } from "file-saver";

export default {
  props: {
    // 保存的文件名
    filename: {
      type: String,
      require: true
    },
    // 要保持的内容
    content: {
      type: [String, Array, Object],
      require: true
    },
    btnText: {
      type: String,
      require: true
    }
  },
  setup() {
    const download = (txt, filename) => {
      let blob = new Blob([txt], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, filename);
    };
    const getDownloadLink = (txt) => {
      if (typeof txt === "string") {
        return "data:text/paint; utf-8," + encodeURIComponent(txt);
      } else {
        return (
          "data:text/paint; utf-8," + encodeURIComponent(JSON.stringify(txt))
        );
      }
    };
    return { download, getDownloadLink };
  }
};
</script>

<style></style>
