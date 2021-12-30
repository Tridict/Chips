<template>
  <!-- 文本区域 -->
  <div class="edit-area col-12 col-xl-6">
    <div class="container my-2 py-2 border border-eee rounded">
      <div
        class="row my-1"
      >
        <div class="col">
          <textarea v-model="textarea" rows="3" class="form-control"></textarea>
          <button
            type="button"
            class="btn btn-success btn-sm"
          >
            确定新增
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const textarea = ref('');
    return { textarea };
  },
};
</script>

<style></style>
