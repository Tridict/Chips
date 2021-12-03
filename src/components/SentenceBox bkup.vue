<template>
  <el-row class="sentence-container">
    <el-card class="sentence-container-left card" shadow="hover">
      <template #header>
        <div class="sentence-title">{{ title }}</div>
      </template>
      <div class="sentence-content">{{ content.text }}</div>
      <div class="sentence-btns">
        <div
          class="text-btn space-btn"
          :class="getBtnClass(0, 'space')"
          @click="handleSelect(0, 'space')"
        >
          <span></span>
        </div>
        <template v-for="(char, i) in content.text" :key="i">
          <div
            class="text-btn"
            :class="getBtnClass(i, 'char')"
            @click="handleSelect(i, 'char')"
          >
            <span>{{ char }}</span>
          </div>
          <div
            class="text-btn space-btn"
            :class="getBtnClass(i + 1, 'space')"
            @click="handleSelect(i + 1, 'space')"
          >
            <span></span>
          </div>
        </template>
      </div>
      <el-row class="toolbar">
        <el-button size="mini" plain @click="handleStart">
          {{ startBtnText }}
        </el-button>
        <el-button size="mini" plain @click="showTextarea = false">
          其他按钮
        </el-button>
        <el-button
          size="mini"
          type="success"
          plain
          @click="handleConfirm"
          v-show="showConfirm"
        >
          确定{{ selectedSpan }}
        </el-button>
      </el-row>
    </el-card>
    <el-card
      v-show="showTextarea"
      class="sentence-container-right"
      shadow="hover"
    >
      <el-input
        v-model="textarea"
        :rows="6"
        type="textarea"
        placeholder="Please input"
      />
    </el-card>
  </el-row>
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

import { ElButton, ElRow, ElCard, ElInput } from "element-plus";
import { reactive, toRefs, computed } from "vue";

export default {
  name: "SentenceBox",
  components: { ElButton, ElRow, ElCard, ElInput },
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
.text-btn {
  width: 1.5em;
  height: 1.5em;
  padding: 0;
  margin: 0.1em;
  text-align: center;
  border: solid 1px #eee;
  border-radius: 0.25em;
}
.text-btn:hover {
  border-color: #aaa;
}
.space-btn {
  width: 0.5em;
}

.left-side {
  background: rgb(240, 255, 220);
}

.between {
  background: rgb(220, 255, 220);
}
.right-side {
  background: rgb(200, 255, 220);
}

.toolbar {
  padding-top: 1rem;
  /* border-top: 1px solid var(--el-border-color-base); */
}
</style>
