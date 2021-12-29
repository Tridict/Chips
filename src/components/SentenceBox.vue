<template>
  <div class="card my-4">
    <div class="card-header">{{ title }}</div>

    <div class="card-body">
      <div class="container">
        <div class="row">
          <div class="col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <div class="row my-2">
                <div
                  v-show="btnStates.currentOpt > OPT_STATUS.readonly"
                  class="sentence-btns"
                >
                  <div
                    class="in-stc-btn space-btn"
                    :class="getBtnClass(0, 'space')"
                    @click="handleSelect(0, 'space')"
                  >
                    <span></span>
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
                      @click="handleSelect(i + 1, 'space')"
                    >
                      <span></span>
                    </div>
                  </template>
                </div>
                <div v-show="btnStates.currentOpt === OPT_STATUS.readonly">
                  {{ content.text }}
                </div>
              </div>

              <hr class="row bg-default my-2" />
              <div class="row my-2">
                <div class="col toolbar">
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
                  <!-- <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="showTextarea = false"
                  >其他按钮</button>-->
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <p class="tool__info text-muted my-0">{{ toolInfo }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <div
                class="row my-1"
                v-show="+btnStates.currentOpt > OPT_STATUS.complete"
              >
                <div class="col">
                  <textarea
                    v-model="textarea"
                    rows="3"
                    class="form-control"
                  ></textarea>
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="onSubmit"
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

    <!-- <div class="card-footer">
    </div>-->
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { forceBlur } from "@/utils/forceBlur.js";

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

  const selectedSpan = computed(() => {
    // return ` [${spanStates.leftId}, ${spanStates.rightId}]`;
    return [spanStates.leftId, spanStates.rightId];
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
  const getBtnClass = (id, type) => {
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

  return {
    selectedSpan,
    handleSelect,
    clearSelect,
    getBtnClass
  };
};

export default {
  name: "SentenceBox",
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
  setup(props, ctx) {
    const data = reactive({
      textarea: "" // 暂存输入的内容
    });

    const btnStates = reactive({
      currentOpt: OPT_STATUS.readonly,
      histroy: []
    });

    const { selectedSpan, handleSelect, clearSelect, getBtnClass } = useSpan(
      btnStates
    );

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
      data.showTextarea = true;
      btnStates.currentOpt += 1;
      forceBlur(event);
    };

    // 点击textarea下方的“确定”按钮
    const onSubmit = () => {
      ctx.emit("submit", {id: props.content.id, annotation: { label: data.textarea, span: selectedSpan.value }});
    };

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
      startBtnText,
      toolInfo,
      selectedSpan,
      isShowConfirmBtn,
      handleSelect,
      getBtnClass,
      onStartOrReset,
      onConfirm,
      onSubmit
    };
  }
};
</script>

<style scoped>
.my-0 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* .border-eee {
  border-color: #eee;
} */

.bg-default {
  background-color: #dee2e6;
}
hr.bg-default {
  opacity: 1;
}

.sentence-container {
  width: 100%;
  margin: 1rem auto;
}
.sentence-container-left,
.sentence-container-right {
  flex: 1;
  min-width: 300px;
}
/* .sentence-title {
  border-bottom: 1px solid var(--el-border-color-base);
} */

.sentence-content {
  padding: 2rem 0;
}

.sentence-btns {
  display: flex;
  flex-wrap: wrap;
  font-size: 1.25em;
}

.in-stc-btn {
  margin: 0.25em 0;
}
.in-stc-btn:hover {
  background: #fdf6ec;
}
.text-btn {
  width: 1.25em;
  height: 1.5em;
  padding: 0;
  text-align: center;
  border: solid 1px #eee;
  border-left: none;
  border-right: none;
}
.text-btn:hover {
  border-color: #f5dab1;
}
.space-btn {
  width: 0.5em;
  height: 1.5em;
  padding: 0;
  text-align: center;
  border: solid 1px #eee;
}
.in-stc-btn:first-child {
  border-left: solid 1px #eee;
}
.in-stc-btn:last-child {
  border-right: solid 1px #eee;
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

/* .toolbar {
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-base);
} */
.toolbar .btn {
  margin: 0 0.5em 0 0;
}
</style>
