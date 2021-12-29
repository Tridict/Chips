<template>
  <div class="card my-4">
    <div class="card-header">{{ title }}</div>

    <div class="card-body">
      <div class="container">
        <div class="row">
          <div class="col-12 col-xl-6">
            <div class="container my-2 py-2 border border-eee rounded">
              <div class="row my-2">
                <div v-show="btnStates.currentOpt > 0" class="sentence-btns">
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
                <div v-show="btnStates.currentOpt == 0">{{ content.text }}</div>
              </div>

              <hr class="row bg-default my-2" />
              <div class="row my-2">
                <div class="col toolbar">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="handleStart"
                    v-if="btnStates.currentOpt != 1"
                  >{{ startBtnText }}</button>
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    @click="handleConfirm"
                    v-show="showConfirm"
                  >确定选取 {{ selectedSpan }}</button>
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
              <div class="row my-1" v-show="+btnStates.currentOpt > 3">
                <div class="col">
                  <textarea v-model="textarea" rows="3" class="form-control"></textarea>
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

export default {
  name: "SentenceBox",
  props: {
    title: {
      type: String,
      default: "#"
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
  setup() {
    const data = reactive({
      // showTextarea: false,
      textarea: ""
    });
    const btnStates = reactive({
      // options: ["readonly", "waiting", "selecting", "complete"],
      currentOpt: 0,
      histroy: [],
      leftId: undefined,
      leftType: "",
      rightId: undefined,
      rightType: ""
    });

    const handleSelect = (id, type) => {
      // console.log(id, type);
      // const currrentState = btnStates.options[btnStates.currentOpt];
      if (btnStates.currentOpt === 1) {
        btnStates.leftId = id;
        btnStates.leftType = type;
        btnStates.currentOpt += 1;
      } else if (btnStates.currentOpt === 2) {
        if (id < btnStates.leftId) {
          btnStates.rightId = btnStates.leftId;
          btnStates.rightType = btnStates.leftType;
          btnStates.leftId = id;
          btnStates.leftType = type;
        } else {
          btnStates.rightId = id;
          btnStates.rightType = type;
        }
        btnStates.currentOpt += 1;
      }

      btnStates.histroy.push(btnStates.currentOpt);
    };

    const getBtnClass = (id, type) => {
      if (id == btnStates.rightId && type == btnStates.rightType && id == btnStates.leftId && type == btnStates.leftType) {
        return "left-side right-side";
      } else if (id == btnStates.leftId && type == btnStates.leftType) {
        return "left-side";
      } else if (
        type == "char" &&
        id >= btnStates.leftId &&
        id < btnStates.rightId
      ) {
        return "between";
      } else if (id == btnStates.rightId && type == btnStates.rightType) {
        return "right-side";
      } else if (
        type == "space" &&
        id > btnStates.leftId &&
        id <= btnStates.rightId
      ) {
        return "between";
      }
    };

    const handleStart = (event) => {
      if (btnStates.currentOpt > 1) {
        // 重新标注
        Object.assign(btnStates, {
          leftId: undefined,
          leftType: "",
          rightId: undefined,
          rightType: ""
        });
      } else {
        // 开始标注
      }
      btnStates.currentOpt = 1;
      forceBlur(event);
    };

    const handleConfirm = (event) => {
      data.showTextarea = true;
      btnStates.currentOpt += 1;
      forceBlur(event);
    };

    const showConfirm = computed(() => {
      return btnStates.currentOpt === 3;
    });
    const selectedSpan = computed(() => {
      return ` [${btnStates.leftId}, ${btnStates.rightId}]`;
    });
    const startBtnText = computed(() => {
      return btnStates.currentOpt > 1
        ? "重新选取"
        : btnStates.currentOpt == 1
          ? "请选取"
          : "新增span";
    });
    const toolInfo = computed(() => {
      // options: ["readonly", "waiting", "selecting", "complete", "annotate"],
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
      startBtnText,
      showConfirm,
      selectedSpan,
      btnStates,
      // currentOpt: toRef(btnStates.currentOpt),
      handleSelect,
      handleStart,
      handleConfirm,
      getBtnClass,
      toolInfo
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
