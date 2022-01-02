<template>
  <div class="card container">
    <div class="row my-1">
      <div class="col">
        <button
          type="button"
          class="btn btn-sm m-1"
          :class="option.check ? 'btn-primary' : 'btn-secondary'"
          v-for="(option, idx) in options"
          :key="idx"
          @click="onCheck(idx)"
        >
          {{ option.text }}
        </button>
        <button
          type="button"
          class="btn btn-info btn-sm m-1"
          @click="isShowInput = true"
        >
          +
        </button>
        <template v-if="isShowInput">
          <input
            type="text"
            class="form-control"
            id="yy"
            v-model="newTagName"
          />
          <button
            type="button"
            class="btn btn-success btn-sm m-1"
            @click="onAdd('ref')"
          >
            新增RefTag
          </button>
          <button
            type="button"
            class="btn btn-success btn-sm m-1"
            @click="onAdd('clue')"
          >
            新增ClueTag
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    options: {
      type: Array,
      require: true
    }
  },
  emits: ["check", "add"],
  setup(props, ctx) {
    const isShowInput = ref(false);
    const newTagName = ref("");
    const onCheck = (idx) => {
      ctx.emit("check", idx);
    };
    const onAdd = (type) => {
      ctx.emit("add", type, newTagName.value);
      newTagName.value = "";
    };

    return { newTagName, isShowInput, onCheck, onAdd };
  }
};
</script>
