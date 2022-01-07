<template>
  <div class="card container" v-if="keys?.length">
    <div class="row my-1">
      <div class="col">
        <Select
          v-for="(key, idx) in keys" :key="idx"
          :keys="key"
          :options="options"
          :id="idx"
          @select="onSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Select from "@/components/Select.vue";

export default {
  components: { Select },
  props: {
    keys: {
      type: Object,
      require: true
    },
    options: {
      type: Array,
      require: true
    }
  },
  emits: ["select"],
  setup(props, ctx) {
    const annotations = props.keys.map(key => {
      return {
        key,
      }
    })
    const onSelect = (pars, idx) => {
      annotations[idx].value = pars;
      ctx.emit('select', annotations);
    };
    return { onSelect };
  }
};
</script>
