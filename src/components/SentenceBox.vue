<template>
  <el-row class="sentence-container">
    <el-card  class="sentence-container-left">
      <div class="sentence-title">{{ title }}</div>
      <div class="sentence-content">{{ content }}</div>
      <el-row class="toolbar">
        <el-button @click="showTextarea = true">开始标注</el-button>
        <el-button @click="showTextarea = false">其他按钮</el-button>
      </el-row>
    </el-card>
    <el-card v-show="showTextarea" class="sentence-container-right">
      <el-input
        v-model="textarea"
        :rows="6"
        type="textarea"
        placeholder="Please input"
      />
    </el-card>
  </el-row>
</template>

<script>
import { ElButton, ElRow, ElCard, ElInput } from "element-plus";
import { ref } from "vue";

export default {
  name: "SentenceBox",
  components: { ElButton, ElRow, ElCard, ElInput },
  setup() {
    return {
      textarea: ref(""),
      showTextarea: ref(false),
      title: ref("1."),
      content: ref("这是句子内容，算是body部分。一个字符串...")
    };
  }
};
</script>

<style scoped>
.sentence-container {
  width: 90vw;
}
.sentence-container-left, .sentence-container-right {
  flex: 1;
  min-width: 300px;
}
.sentence-title {
  border-bottom: 1px solid var(--el-border-color-base);
}

.sentence-content {
  padding: 2rem 0;
}

.toolbar {
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-base);
}

</style>
