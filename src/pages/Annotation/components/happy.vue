<template>
  <div class="card container">
    <div class="row my-1">
      <div class="col">
        <div class="input-group" v-for="(option, idx) in options" :key="idx">
          <label class="input-group-text" for="xx">{{ option }}:</label>
          <select class="form-select" id="xx" v-model="input.value">
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
import { ref } from "vue";

export default {
  props: {
    options: {
      type: Array,
      require: true
    }
  },
  emits: ["submit"],
  setup(props) {
    const input = ref(props.options[0]);
    return { input };
  }
};
</script>
