<template>
  <Select
    keys=""
    :options="indTagList"
    :selected="selectedTag"
    @select="onSelectTag"
  />
  <Happy
    v-if="ActiveAttrList[0]?.attrs?.length"
    :keys="ActiveAttrList[0]?.attrs"
    :options="annotations"
    @select="onSelectAttr"
  />
  <div class="row my-1">
    <div class="col">
      <button type="button" class="btn btn-success btn-sm" @click="onSubmit">
        确定
      </button>
    </div>
  </div>
</template>

<script>
import Select from "@/components/Select.vue";
import Happy from "./happy.vue";
import { reactive, watch, toRefs, inject } from "vue";

export default {
  components: { Select, Happy },
  props: ["schema", "annotations", "sentenceId"],
  emits: ["submit"],
  setup(props) {
    const addAnnotation = inject("addAnnotation");

    const data = reactive({
      indTags: props.schema?.getIndTags() || [],
      indTagList: [],
      ActiveAttrList: [], // 在输入框展示的数据
      selectedTag: ""
    });

    const initIndTagList = () => {
      data.indTagList = data.indTags.map((x) => {
        return x.tagName;
      });

      const watchTagList = (newVal, oldVal) => {
        if (newVal.length === oldVal.length + 1) {
          const newItem = newVal[newVal.length - 1];
          data.indTagList.push(newItem);
        }
      };

      watch(() => data.indTags, watchTagList);
    };

    initIndTagList();

    const indTagHandlers = {
      // 点击“确定”按钮
      onSubmit: () => {
        // 提交当前数据
        data.indTags.forEach((x) => {
          if (!x.annotation?.length) return;
          const annotations = {};
          x.annotation.forEach((y) => {
            annotations[y.key] = "#" + y.value._id;
          });
          addAnnotation({
            id: props.sentenceId,
            annotation: {
              _tagMode: "CC",
              _tag: x.tagName,
              ...annotations
            }
          });
          x.annotation = [];
        });

        // 清空
        // data.ActiveAttrList = [];
        data.selectedTag = "";
      },

      // 选择indTag
      onSelectTag: (selectedText) => {
        data.ActiveAttrList = data.indTags.filter(
          (x) => x.tagName === selectedText
        );
        data.selectedTag = selectedText;
      },

      onSelectAttr: (selectedText) => {
        data.ActiveAttrList[0].annotation = selectedText;
      }
    };

    return {
      ...toRefs(data),
      ...indTagHandlers
    };
  }
};
</script>

<style></style>
