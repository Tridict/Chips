<template>
  <div class="card container">
    <div class="row my-1">
      <div class="col">
        <div class="input-group">
          <label class="input-group-text" for="xx">Key:</label>
          <select class="form-select" id="xx" v-model="input.key">
            <option v-for="(option, idx) in options" :key="idx" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  props: {
    options: {
      type: Array,
      require: true
    }
  },
  emits: ["submit"],
  setup(props, ctx) {
    const input = reactive({
      key: "",
      value: ""
    });
    const onSubmit = () => {
      // 提交
      ctx.emit("submit", input);

      // 重置
      input.key = "";
      input.value = "";
    };
    return { input, onSubmit };
  }
};
</script>
