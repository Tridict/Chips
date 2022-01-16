<template>
  <div class="input-group">
    <label class="input-group-text" for="xx" v-if="keys">{{ keys }}:</label>
    <select class="form-select" id="xx" v-model="input">
      <option v-for="(option, idx) in options" :key="idx" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
  props: {
    keys: {
      type: String,
      require: true,
    },
    options: {
      type: Array,
      require: true,
    },
    id: {
      type: Number,
    },
    selected: {
      type: String,
    },
  },
  emits: ["select"],
  setup(props, ctx) {
    const input = ref("");
    watch(
      () => props.selected,
      newVal => {
        input.value = newVal;
      },
    );
    watch(input, () => {
      ctx.emit("select", input.value, props.id);
    });
    return { input };
  },
};
</script>

<style></style>
