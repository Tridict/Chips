<template>
  <div class="card my-3">
    <div class="card-header">{{ title }} {{ content.text }}</div>

    <div class="card-body" v-show="btnStates.currentOpt > 0">
      <!-- <h5 class="card-title">Special title treatment</h5> -->
      <!-- <p class="card-text">
        {{ content.text }}
      </p> -->
      <div class="sentence-btns">
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
      <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
    </div>
    
    <div class="card-body" v-show="btnStates.currentOpt == 0">
      <div>{{ content.text }}</div>
    </div>







    <div class="card-footer">
      <div class="container toolbar">
        <div class="row my-1">
          <div class="col">
            <button type="button" class="btn btn-primary btn-sm" @click="handleStart">{{ startBtnText }}</button>
            <button type="button" class="btn btn-primary btn-sm" @click="showTextarea = false">其他按钮</button>
            <button type="button" class="btn btn-success btn-sm" @click="handleConfirm" v-show="showConfirm">确定{{ selectedSpan }}</button>
          </div>
        </div>
        <div class="row my-1" v-show="showTextarea">
          <div class="col">
            <textarea v-model="textarea" rows="3" class="form-control"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 点击按钮后手动失焦
const forceBlur = (event) => {
  let target = event.target;
  console.log(target);
  if (target.parentNode.className.split(/\s+/).includes("el-button")) {
    target = target.parentNode;
  }
  target.blur();
};

// import { ElButton, ElRow, ElCard, ElInput } from "element-plus";
import { reactive, toRefs, computed } from "vue";

export default {
  name: "SentenceBox",
  // components: { ElButton, ElRow, ElCard, ElInput },
  setup() {
    const data = reactive({
      textarea: "",
      showTextarea: false,
      title: "1.",
      content: {
        text: "这是句子内容，算是body部分。一个字符串...",
        annotations: []
      }
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
      if (id == btnStates.leftId && type == btnStates.leftType) {
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
        ? "重新标注"
        : btnStates.currentOpt == 1
        ? "请标注"
        : "开始标注";
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
      getBtnClass
    };
  }
};
</script>

<style scoped>
.sentence-container {
  width: 100%;
  margin: 1rem auto;
}
.sentence-container-left,
.sentence-container-right {
  flex: 1;
  min-width: 300px;
}
.sentence-title {
  /* border-bottom: 1px solid var(--el-border-color-base); */
}

.sentence-content {
  padding: 2rem 0;
}

.sentence-btns {
  display: flex;
  flex-wrap: wrap;
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
.left-side:hover, .right-side:hover {
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

.toolbar {
  /* padding-top: 1rem; */
  /* border-top: 1px solid var(--el-border-color-base); */
}
.toolbar .btn {margin: 0 0.5em 0 0;}
</style>
