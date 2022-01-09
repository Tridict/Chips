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
                      :title="`${i + 1}号位置`"
                      @click="handleSelect(i + 1, 'space')"
                    >
                      <span class="space-btn-idx">{{ i + 1 }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- 已标注内容区域 -->
            <div
              class="container my-2 py-2 border border-eee rounded"
              v-show="content.annotations.length"
            >
              <div class="existed-annotations">
                <div
                  class="existed-annotations__item_wrap"
                  v-for="(item, idx) in content.annotations"
                  :key="idx"
                >
                  <div
                    class="existed-annotations__item"
                    @mouseover="onHoverExistedAnnotations(item.span)"
                    @mouseout="onHoverEnd"
                  >
                    <div class="existed-annotations__item__span_left">
                      {{
                        item?.span?.[0] ??
                        (item?.content?.key
                          ? `旁批 ${item.content?.key}`
                          : "创建-绑定")
                      }}
                    </div>
                    <div class="existed-annotations__item__label">
                      {{
                        item._tag
                          ? `${item._tag}( ${content.text.slice(
                              item?.span?.[0] ?? 0,
                              item?.span?.[1] ?? 0
                            )} )`
                          : false || `${item?.content?.value}`
                      }}
                    </div>
                    <div
                      class="existed-annotations__item__span_right"
                      v-show="item?.span?.[1] > 0"
                    >
                      {{ item?.span?.[1] ?? "" }}
                    </div>
                  </div>
                </div>
                <div class="je-container" ref="jecontainer"></div>
              </div>
            </div>
          </div>
          <!-- 右边区域 -->
          <div class="annotate-area col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <!-- 按钮区域 -->
              <div class="row my-2">
                <div class="toolbar col">
                  <!-- 旁批 -->
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :class="{ 'btn-success': isShowMetaInput }"
                    @click="onToggleMeta"
                    v-if="!isShowIndTags && !isShowAnnotation"
                  >
                    {{ isShowMetaInput ? "结束旁批" : "新增旁批" }}
                  </button>
                  <!-- 创建-绑定 -->
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :class="{ 'btn-success': isShowIndTags }"
                    @click="isShowIndTags = !isShowIndTags"
                    v-if="!isShowMetaInput && !isShowAnnotation"
                  >
                    {{ isShowIndTags ? "完成复合对象" : "新增复合对象" }}
                  </button>
                  <!-- 注释模式 -->
                  <template v-if="!isShowIndTags && !isShowMetaInput">
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
                  </template>
                </div>
              </div>
              <!-- 按钮底部操作说明指南 -->
              <div class="tool-info-wrap row">
                <div class="col">
                  <p class="tool__info text-muted my-0">{{ toolInfo }}</p>
                </div>
              </div>

              <!-- 输入区域 -->
              <!-- 旁批模式 -->
              <InputField
                :options="metaSlotsKeys"
                v-show="isShowMetaInput"
                @submit="onSubmitMeta"
              />
              <!-- 创建-绑定模式 -->
              <template v-if="isShowIndTags">
                <CreateBindMode
                  :schema="schema"
                  :annotations="content.annotations"
                  :sentenceId="content.id"
                  @submit="onSubmitIndTags"
                />
              </template>
              <!-- 注释模式 -->
              <CheckBtns
                :options="tagList"
                :showAdd="true"
                v-show="+btnStates.currentOpt > OPT_STATUS.complete"
                @check="onCheckTag"
                @add="handleAddTag"
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
import { reactive, toRefs, inject, watch, computed } from "vue";
import { useSpan } from "./useSpan.js";
import { useJsonEditor } from "@/utils/jsonEditor";
import { Schema } from "@/utils/schema/Schema.js";

import InputField from "./inputField.vue";
import CheckBtns from "./checkBtns.vue";
import CreateBindMode from "./CreateBindMode/index.vue";

export default {
  name: "SentenceBox",
  components: { InputField, CheckBtns, CreateBindMode },
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
      isShowIndTags: false,
      isShowAnnotation: false,
      // isShowIndTagItem: false,
      metaSlotsKeys: schema.getMetaSlots(),
      refTags: schema.getRefTags(),
      clueTags: schema.getClueTags(),
      indTags: schema.getIndTags(),
      tagList: []
    });

    const {
      btnStates,
      OPT_STATUS,
      selectedSpan,
      annotateBtn,
      spanData,
      handleSelect,
      clearSelect,
      getBtnClass,
      onHoverExistedAnnotations,
      onHoverEnd
    } = useSpan(data);

    const { jecontainer } = useJsonEditor(computed(() => props.content.annotations), {
      modes: ["view", "code"]
    });

    const initTagList = () => {
      data.tagList = [
        ...data.refTags.map((x) => {
          return {
            check: false,
            text: x
          };
        }),
        ...data.clueTags.map((x) => {
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

      watch(() => data.clueTags, watchTagList);
      watch(() => data.refTags, watchTagList);
    };

    initTagList();

    // 旁批 事件处理函数
    const metaHandlers = {
      // 点击“新增旁批”按钮
      onToggleMeta: () => {
        data.isShowMetaInput = !data.isShowMetaInput;
      },

      // 点击加号
      onSubmitMeta: (input) => {
        addAnnotation({
          id: props.content.id,
          annotation: {
            content: { key: input.key, value: input.value },
            _tagMode: "meta",
          }
        });
      }
    };

    const annotateHandlers = {
      // “注释”: 选择Tag
      onCheckTag: (idx) => {
        data.tagList[idx].check = !data.tagList[idx].check;
      },

      // “注释”: 新增Tag
      handleAddTag: (type, tagName) => {
        if (type === "ref") {
          schema.addRefTag(tagName);
        } else {
          schema.addClueTag(tagName);
        }
      },

      // “注释”: 点击“确定”按钮
      onSubmitAnnotation: () => {
        // 提交当前数据
        data.tagList.forEach((x) => {
          if (x.check) {
            addAnnotation({
              id: props.content.id,
              annotation: {
                _tag: x.text,
                span: selectedSpan.value,
                _tagMode: "annotation"
              }
            });
            x.check = false;
          }
        });
        // 改变UI：可以开始下一段标注。
        clearSelect();
        btnStates.currentOpt = OPT_STATUS.ready;
      }
    };

    return {
      schema,
      ...toRefs(data),
      ...toRefs(spanData),
      ...annotateBtn,
      ...metaHandlers,
      ...annotateHandlers,
      jecontainer,
      OPT_STATUS,
      btnStates,
      selectedSpan,
      handleSelect,
      getBtnClass,
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
  margin: 0.1rem;
  line-height: normal;
}

.existed-annotations__item {
  display: inline-block;
  margin: 3px;
  border-radius: 0.2rem;
  border: 1px solid #eee;
  background: #fafafa;
  overflow: hidden;
}
.existed-annotations__item__label,
.existed-annotations__item__span_left,
.existed-annotations__item__span_right {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  height: 100%;
  border: 1px solid #eee;
}
.existed-annotations__item__span_left,
.existed-annotations__item__span_right {
  padding: 0.25rem;
  /* background: #eee; */
  color: #aaa;
}
.existed-annotations__item:hover {
  border: 1px solid #aaa;
}
.existed-annotations__item:hover > .existed-annotations__item__span_left,
.existed-annotations__item:hover > .existed-annotations__item__span_right {
  color: #888;
}
</style>
