<template>
  <div class="card my-4">
    <div class="card-header">{{ title }}</div>

    <div class="card-body">
      <div class="container">
        <div class="row">
          <!-- 句子区域 -->
          <div class="sentence-area col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <!-- 标注的句子 -->
              <div class="sentence-wrap row my-2">
                <div
                  class="sentence-btns"
                  :class="{ 'sentence-btns--readonly': isReadonly }"
                >
                  <div
                    class="in-stc-btn space-btn"
                    :class="getBtnClass(0, 'space')"
                    title="0号位置"
                    @click="handleSelect(0, 'space')"
                  >
                    <span class="space-btn-idx">0</span>
                  </div>
                  <template v-for="(char, i) in content.text" :key="i">
                    <div
                      class="in-stc-btn text-btn"
                      :class="getBtnClass(i, 'char')"
                      @click="handleSelect(i, 'char')"
                    >
                      <span>{{ char }}</span>
                    </div>
                    <div
                      class="in-stc-btn space-btn"
                      :class="getBtnClass(i + 1, 'space')"
                      :title="`${i+1}号位置`"
                      @click="handleSelect(i + 1, 'space')"
                    >
                      <span class="space-btn-idx">{{i+1}}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="container my-2 py-2 border border-eee rounded">
              <!-- 已标注内容区域 -->
              <div
                class="existed-annotations"
                v-if="content.annotations.length"
              >
              <div class="existed-annotations__item_wrap" v-for="(item, idx) in content.annotations" :key="idx">
                <div
                  class="existed-annotations__item"
                  @mouseover="onHoverExistedAnnotations(item.span)"
                  @mouseout="onHoverEnd"
                >
                  <div class="existed-annotations__item__span_left">
                    {{ item?.span?.[0] ?? `旁批 ${item.content.key}` }}
                  </div>
                  <div class="existed-annotations__item__label">
                    {{
                      item.label ? `${item.label}( ${content.text.slice(item?.span?.[0]??0, item?.span?.[1]??0)} )`:false || `${item.content.value}`
                    }}
                  </div>
                  <div class="existed-annotations__item__span_right" v-show="item?.span?.[1]>0">
                    {{ item?.span?.[1] ?? "" }}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
          <!-- 右边区域 -->
          <div class="annotate-area col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <!-- 按钮区域 -->
              <div class="row my-2">
                <div class="toolbar col">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :class="{ 'btn-success': isShowMetaInput }"
                    @click="onToggleMeta"
                  >
                    {{ isShowMetaInput ? "结束旁批" : "新增旁批" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="onStartOrReset"
                    v-if="btnStates.currentOpt !== OPT_STATUS.ready"
                  >
                    {{ startBtnText }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="onConfirm"
                    v-show="isShowConfirmBtn"
                  >
                    确定选取 {{ selectedSpan }}
                  </button>
                  <button
                    v-if="btnStates.currentOpt > OPT_STATUS.readonly"
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="onFinish"
                  >
                    结束标注
                  </button>
                </div>
              </div>
              <!-- 按钮底部操作说明指南 -->
              <div class="tool-info-wrap row">
                <div class="col">
                  <p class="tool__info text-muted my-0">{{ toolInfo }}</p>
                </div>
              </div>

              <!-- 文本区域 -->
              <InputField
                :options="metaSlotsKeys"
                v-show="isShowMetaInput"
                @submit="onSubmitMeta"
              />
              <CheckBtns
                :options="tagList"
                v-show="+btnStates.currentOpt > OPT_STATUS.complete"
                @check="onCheckTag"
                @add="onAddTag"
              />
              <div
                class="row my-1"
                v-show="+btnStates.currentOpt > OPT_STATUS.complete"
              >
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="onSubmitAnnotation"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, inject, watch } from "vue";
import { forceBlur } from "@/utils/forceBlur.js";
import { Schema } from "@/utils/schema/Schema.js";
import InputField from "./inputField.vue";
import CheckBtns from "./checkBtns.vue";

const OPT_STATUS = {
  readonly: 0,
  ready: 1,
  selecting: 2,
  complete: 3,
  annotate: 4
};

const useSpan = (btnStates) => {
  const spanStates = reactive({
    leftId: undefined,
    leftType: "",
    rightId: undefined,
    rightType: ""
  });
  const spanStatesBackup = reactive({
    leftId: undefined,
    leftType: "",
    rightId: undefined,
    rightType: ""
  });

  const selectedSpan = computed(() => {
    return [
      spanStates.leftId,
      spanStates.rightType === "char"
        ? spanStates.rightId + 1
        : spanStates.rightId
    ];
  });

  // 选取文本片段
  const handleSelect = (id, type) => {
    if (btnStates.currentOpt === OPT_STATUS.ready) {
      spanStates.leftId = id;
      spanStates.leftType = type;
      btnStates.currentOpt += 1;
    } else if (btnStates.currentOpt === OPT_STATUS.selecting) {
      if (id < spanStates.leftId) {
        spanStates.rightId = spanStates.leftId;
        spanStates.rightType = spanStates.leftType;
        spanStates.leftId = id;
        spanStates.leftType = type;
      } else {
        spanStates.rightId = id;
        spanStates.rightType = type;
      }
      btnStates.currentOpt += 1;
    }

    btnStates.histroy.push(btnStates.currentOpt);
  };

  // 重新标注：清除选择
  const clearSelect = () => {
    Object.assign(spanStates, {
      leftId: undefined,
      leftType: "",
      rightId: undefined,
      rightType: ""
    });
  };

  // 控制选取后的文字样式
  const getAnnotateBtnClass = (id, type) => {
    if (
      id == spanStates.rightId &&
      type == spanStates.rightType &&
      id == spanStates.leftId &&
      type == spanStates.leftType
    ) {
      return "left-side right-side";
    } else if (id == spanStates.leftId && type == spanStates.leftType) {
      return "left-side";
    } else if (
      type == "char" &&
      id >= spanStates.leftId &&
      id < spanStates.rightId
    ) {
      return "between";
    } else if (id == spanStates.rightId && type == spanStates.rightType) {
      return "right-side";
    } else if (
      type == "space" &&
      id > spanStates.leftId &&
      id <= spanStates.rightId
    ) {
      return "between";
    }
  };

  // 控制hover时的文字样式
  const getHoverClass = (id, type) => {
    if (id >= spanStatesBackup.leftId && id < spanStatesBackup.rightId) {
      return "highlight";
    } else if (id === spanStatesBackup.rightId && type === "space") {
      return "highlight";
    } else {
      return "";
    }
  };

  const getBtnClass = (id, type) => {
    return getAnnotateBtnClass(id, type) + " " + getHoverClass(id, type);
  };

  // 鼠标移到已有标注上时，显示高亮
  const onHoverExistedAnnotations = (span) => {
    Object.assign(spanStatesBackup, {
      leftId: span?.[0] || 0,
      leftType: "space",
      rightId: span?.[1] || 0,
      rightType: "space"
    });
  };

  const onHoverEnd = () => {
    Object.assign(spanStatesBackup, {
      leftId: undefined,
      leftType: "",
      rightId: undefined,
      rightType: ""
    });
  };

  return {
    selectedSpan,
    onHoverExistedAnnotations,
    onHoverEnd,
    handleSelect,
    clearSelect,
    getBtnClass
  };
};

export default {
  name: "SentenceBox",
  components: { InputField, CheckBtns },
  props: {
    title: {
      type: String,
      require: true
    },
    content: {
      type: Object,
      default: () => {
        return {
          text: "这是句子内容，算是body部分。一个字符串...",
          annotations: []
        };
      }
    }
  },
  emits: ["submit"],
  setup(props) {
    const schema = new Schema();
    const addAnnotation = inject("addAnnotation");

    const data = reactive({
      isShowMetaInput: false,
      metaSlotsKeys: schema.getMetaSlots(),
      refTagList: schema.getRefTags(),
      clueTagList: schema.getClueTags(),
      tagList: []
    });

    const initTagList = () => {
      data.tagList = [
        ...data.refTagList.map((x) => {
          return {
            check: false,
            text: x
          };
        }),
        ...data.clueTagList.map((x) => {
          return {
            check: false,
            text: x
          };
        })
      ];

      const watchTagList = (newVal, oldVal) => {
        if (newVal.length === oldVal.length + 1) {
          const newItem = newVal[newVal.length - 1];
          data.tagList.push({
            check: false,
            text: newItem
          });
        }
      };

      watch(() => data.clueTagList, watchTagList);
      watch(() => data.refTagList, watchTagList);
    };

    initTagList();

    const btnStates = reactive({
      currentOpt: OPT_STATUS.readonly,
      histroy: []
    });

    const {
      selectedSpan,
      handleSelect,
      clearSelect,
      getBtnClass,
      onHoverExistedAnnotations,
      onHoverEnd
    } = useSpan(btnStates);

    // 点击“新增旁批”按钮
    const onToggleMeta = () => {
      data.isShowMetaInput = !data.isShowMetaInput;
    };

    // 点击“新增span/重新选取”按钮
    const onStartOrReset = (event) => {
      if (btnStates.currentOpt > OPT_STATUS.ready) {
        clearSelect(); // 重新标注
      } else {
        // 开始标注
      }
      btnStates.currentOpt = OPT_STATUS.ready;
      forceBlur(event);
    };
    // 点击“确定选取“按钮
    const onConfirm = (event) => {
      btnStates.currentOpt += 1;
      forceBlur(event);
    };
    const onCheckTag = (idx) => {
      data.tagList[idx].check = !data.tagList[idx].check;
    };
    const onAddTag = (type, tagName) => {
      if (type === "ref") {
        schema.addRefTag(tagName);
      } else {
        schema.addClueTag(tagName);
      }
    };
    // 点击tagList下方的“确定”按钮
    const onSubmitAnnotation = () => {
      // 提交当前数据
      data.tagList.forEach((x) => {
        if (x.check) {
          addAnnotation({
            id: props.content.id,
            annotation: {
              label: x.text,
              span: selectedSpan.value,
              type: "annotation"
            }
          });
          x.check = false;
        }
      });
      // 改变UI：可以开始下一段标注。
      clearSelect();
      btnStates.currentOpt = OPT_STATUS.ready;
    };
    // 点击key value输入框后面的加号
    const onSubmitMeta = (input) => {
      addAnnotation({
        id: props.content.id,
        annotation: {
          content: { key: input.key, value: input.value },
          type: "meta"
        }
      });
    };
    // 点击"结束标注"按钮
    const onFinish = () => {
      btnStates.currentOpt = OPT_STATUS.readonly;
      clearSelect();
    };

    const isReadonly = computed(() => {
      return btnStates.currentOpt === OPT_STATUS.readonly;
    });
    const isShowConfirmBtn = computed(() => {
      return btnStates.currentOpt === OPT_STATUS.complete;
    });
    const startBtnText = computed(() => {
      return btnStates.currentOpt > OPT_STATUS.ready
        ? "重新选取"
        : btnStates.currentOpt == OPT_STATUS.ready
        ? "请选取"
        : "新增span";
    });
    const toolInfo = computed(() => {
      const infos = [
        undefined,
        "请选取要标注的文本片段的开始位置",
        "请选取要标注的文本片段的结束位置",
        "请确定",
        "请开始标注或加入span列表"
      ];
      return infos[+btnStates.currentOpt];
    });
    return {
      ...toRefs(data),
      OPT_STATUS,
      btnStates,
      selectedSpan,
      isReadonly,
      isShowConfirmBtn,
      startBtnText,
      toolInfo,
      handleSelect,
      getBtnClass,
      onToggleMeta,
      onStartOrReset,
      onConfirm,
      onCheckTag,
      onAddTag,
      onSubmitAnnotation,
      onSubmitMeta,
      onFinish,
      onHoverExistedAnnotations,
      onHoverEnd
    };
  }
};
</script>

<style scoped>
.bg-default {
  background-color: #dee2e6;
}
hr.bg-default {
  opacity: 1;
}

/* .sentence-content {
  padding: 2rem 0;
} */

.sentence-btns {
  display: flex;
  flex-wrap: wrap;
  font-size: 1.25em;
}

.sentence-btns--readonly > * {
  border: none !important;
  /* margin: calc(0.25em + 1px) 1px !important; */
}

.sentence-btns--readonly > .space-btn {
  width: 0.1em;
}

.sentence-btns--readonly > .space-btn .space-btn-idx {
  font-size: 0;
  color: transparent;
}
.sentence-btns--readonly > .text-btn {
  width: auto;
  /* width: 1em; */
}

.in-stc-btn {
  margin: 0.25em 0;
  height: 1.5em;
  padding: 0;
  text-align: center;
  border: solid 1px #eee;
  transition: width ease-in 0.1s;
}
.in-stc-btn:hover {
  background: #fdf6ec;
}
.in-stc-btn.highlight {
  background: #ffea2b;
}
.in-stc-btn:first-child {
  border-left: solid 1px #eee;
}
.in-stc-btn:last-child {
  border-right: solid 1px #eee;
}

.text-btn {
  width: 1.25em;
  border-left: none;
  border-right: none;
}
.text-btn:hover {
  border-color: #f5dab1;
}

.space-btn {
  width: 0.5em;
  overflow: hidden;
}

.space-btn .space-btn-idx {
  font-size: 0.25em;
  color: #aaa;
}
.space-btn:hover {
  border-color: #aaa;
  background: #aaa;
}

.left-side {
  background: #ecf5ff;
  border: solid 1px #b3d8ff;
  color: #409eff;
  border-top-left-radius: 0.25em;
  border-bottom-left-radius: 0.25em;
}
.text-btn.left-side {
  border-right: none;
}
.right-side {
  background: #ecf5ff;
  border: solid 1px #b3d8ff;
  color: #409eff;
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
}
.text-btn.right-side {
  border-left: none;
}
.text-btn.left-side.right-side {
  border-left: solid 1px #b3d8ff;
  border-right: solid 1px #b3d8ff;
}
.left-side:hover,
.right-side:hover {
  border-color: #b3d8ff;
  background: #ecf5ff;
}

.left-side:first-child {
  border-left: solid 1px #b3d8ff;
}
.right-side:last-child {
  border-right: solid 1px #b3d8ff;
}

.between {
  background: #f0f9eb;
  border-color: #c2e7b0;
  color: #67c23a;
}
.between:hover {
  border-color: #c2e7b0;
  background: #f0f9eb;
}

.toolbar .btn {
  margin: 0 0.5em 0 0;
}

.existed-annotations {
  margin: .1rem;
  line-height: normal;
}

.existed-annotations__item {
  display: inline-block;
  margin: 3px;
  border-radius: .2rem;
  border:1px solid #eee;
  background: #fafafa;
  overflow: hidden;
}
.existed-annotations__item__label, .existed-annotations__item__span_left, .existed-annotations__item__span_right {
  display: inline-block;
  padding: .25rem .5rem;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.5;
  height: 100%;
  border:1px solid #eee;
}
.existed-annotations__item__span_left, .existed-annotations__item__span_right {
  padding: .25rem;
  /* background: #eee; */
  color: #aaa;
}
.existed-annotations__item:hover {
  border:1px solid #aaa;
}
.existed-annotations__item:hover > .existed-annotations__item__span_left,
.existed-annotations__item:hover > .existed-annotations__item__span_right {
  color: #888;
}
</style>
