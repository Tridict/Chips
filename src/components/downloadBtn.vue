<template>
  <!-- 导出 -->
  <a class="export-wrap" :download="filename" :href="getDownloadLink(content)">
    <button>{{ btnText }}</button>
  </a>
</template>

<script>
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
    const getDownloadLink = (txt) => {
      if (typeof txt === "string") {
        return "data:text/paint; utf-8," + encodeURIComponent(txt);
      } else {
        return "data:text/paint; utf-8," + encodeURIComponent(JSON.stringify(txt));
      }
    };
    return { getDownloadLink };
  }
};
</script>

<style></style>
