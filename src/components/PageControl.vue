<template>
  <div class="row my-0">
    <div class="col my-1 col-12 col-lg-6">
      <div class="input-group input-group-sm">
        <div class="input-group-text">跳转到第</div>
        <input
          type="text"
          class="form-control text-input-slim"
          v-model="plan.page"
        />
        <div class="input-group-text">页</div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="goPage(plan.page)"
          >GO!</button
        >
      </div>
    </div>
    <div class="col my-1 col-12 col-lg-6">
      <div class="input-group input-group-sm">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="goPage(current.page - 1)"
          >上一页</button
        >
        <div class="input-group-text"
          >第 {{ current.page }} / {{ totalPage }} 页</div
        >
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="goPage(current.page + 1)"
          >下一页</button
        >
      </div>
    </div>
    <div class="col my-1 col-12 col-lg-6">
      <div class="input-group input-group-sm">
        <div class="input-group-text">每页</div>
        <input
          type="text"
          class="form-control text-input-slim"
          v-model="plan.perPage"
        />
        <div class="input-group-text">条</div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="reloadPage(plan.start, plan.start + plan.perPage - 1)"
          >GO!</button
        >
      </div>
    </div>
    <div class="col my-1 col-12 col-lg-6">
      <div class="input-group input-group-sm">
        <div class="input-group-text">从第</div>
        <input
          type="text"
          class="form-control text-input-slim"
          v-model="plan.start"
        />
        <div class="input-group-text">条到第</div>
        <input
          type="text"
          class="form-control text-input-slim"
          v-model="plan.end"
        />
        <div class="input-group-text">条</div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="reloadPage(plan.start, plan.end)"
          >GO!</button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from "vue";
export default {
  props: {
    len: {
      default: 100
    },
  },
  emits: ["start", "end"],
  setup(props, ctx) {
    const data = reactive({
      current: {
        start: 0,
        perPage: 10,
        end: 9,
        page: 1,
      },
      plan: {
        start: 0,
        perPage: 10,
        end: 9,
        page: 1,
      },
    })
    const totalPage = computed(() => {
      return 2;
    });
    const updatePages = () => {
      data.plan.page = Math.max(Math.min(data.plan.page, totalPage.value), 1);
      data.current.page = data.plan.page;
      data.plan.start = (data.plan.page - 1) * data.plan.perPage;
      data.plan.end = Math.min(
        data.plan.start + data.plan.perPage - 1,
        props.len,
      );
      ctx.emit("start", data.plan.start);
      ctx.emit("end", data.plan.end);
    };
    const goPage = page => {
      data.plan.page = page;
      updatePages();
      console.log(`前往第${data.plan.page}页`);
    };
    // const reloadPage = (start, end) => {};
    return { ...toRefs(data), totalPage, goPage };
  },
};
</script>

<style></style>
