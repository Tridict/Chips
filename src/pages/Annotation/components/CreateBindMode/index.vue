<template>
  <Select
    keys
    :options="indTagList"
    :selected="selectedTag"
    @select="onSelectTag"
  />
  <Happy
    v-if="ActiveAttrList?.attrs?.length"
    :keys="ActiveAttrList?.attrs"
    :options="formattedAnnotations"
    @select="onSelectAttr"
  />
  <div class="row my-1">
    <div class="col">
      <button type="button" class="btn btn-success btn-sm" @click="onSubmit"
        >确定</button
      >
    </div>
  </div>
</template>

<script>
import Select from "@/components/Select.vue";
import Happy from "./happy.vue";
import { reactive, watch, toRefs, inject, computed } from "vue";

export default {
  components: { Select, Happy },
  props: ["schema", "annotations", "sentenceId", "text"],
  emits: ["finish"],
  setup(props, ctx) {
    const addAnnotation = inject("addAnnotation");

    const formattedAnnotations = computed(() => {
      return props.annotations.map(x => {
        const item = x;
        const text = props.text;
        let face = item._tag
          ? `${item._tag}( ${text.slice(
              item?.span?.[0] ?? 0,
              item?.span?.[1] ?? 0,
            )} )`
          : false || `${item?.content?.value}`;
        const faceFn = {
          meta: () =>
            `#${item?._id ?? "_"}: ${item?.content?.key}(${
              item?.content?.value
            })`,
          annotation: () =>
            `#${item?._id ?? "_"}: ${item?._tag ?? "_"}(${text.slice(
              item?.span?.[0] ?? 0,
              item?.span?.[1] ?? 0,
            )}) span[${item?.span?.[0] ?? "_"},${item?.span?.[1] ?? "_"}]`,
          CC: () => `#${item?._id ?? "_"}: ${item?._tag ?? "_"}()`,
        };
        face = faceFn[item?._tagMode]();
        return { face, _id: item?._id };
      });
    });

    const data = reactive({
      indTags: props.schema?.getIndTags() || [],
      indTagList: [],
      ActiveAttrList: [], // 在输入框展示的数据
      selectedTag: "",
    });

    const initIndTagList = () => {
      data.indTagList = data.indTags.map(x => {
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
        console.log(data.ActiveAttrList);
        // 提交当前数据
        if (!data.ActiveAttrList?.attrs?.length) {
          addAnnotation({
            id: props.sentenceId,
            annotation: {
              _tagMode: "CC",
              _tag: data.selectedTag,
            },
          });
        } else {
          data.indTags.forEach(x => {
            if (!x.annotation?.length) {
              // console.log(x);
              return;
            }
            const annotations = {};
            console.log(x.annotation);
            x.annotation.forEach(y => {
              // const notNil = (x) => !(x ?? true) || !! x;
              // let jjj = notNil(y?.value?._id);
              console.log(y.value);
              if (y.value != null) {
                annotations[y.key] = y.value;
              }
            });
            addAnnotation({
              id: props.sentenceId,
              annotation: {
                _tagMode: "CC",
                _tag: x.tagName,
                ...annotations,
              },
            });
            x.annotation = [];
          });
        }

        // 清空
        // data.ActiveAttrList = [];
        data.selectedTag = "";
        ctx.emit("finish");
      },

      // 选择indTag
      onSelectTag: selectedThing => {
        data.ActiveAttrList = data.indTags.filter(
          x => x.tagName === selectedThing,
        )[0];
        data.selectedTag = selectedThing;
      },

      onSelectAttr: selectedThing => {
        data.ActiveAttrList.annotation = selectedThing;
        console.log(selectedThing);
      },
    };

    return {
      ...toRefs(data),
      ...indTagHandlers,
      formattedAnnotations,
    };
  },
};
</script>

<style></style>
