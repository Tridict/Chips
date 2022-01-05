import { reactive, computed } from "vue";
import { forceBlur } from "@/utils/forceBlur.js";

const OPT_STATUS = {
  readonly: 0,
  ready: 1,
  selecting: 2,
  complete: 3,
  annotate: 4
};

// 选取span过程中，文字按钮的样式控制
const useSelect = (btnStates) => {
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

// 注释模式选取span过程中的按钮状态改变及方法控制
export const useSpan = (data) => {
  const btnStates = reactive({
    currentOpt: OPT_STATUS.readonly,
    histroy: []
  });

  // 根据btnStates计算出的html视图控制
  const spanData = reactive({
    isReadonly: computed(() => {
      return btnStates.currentOpt === OPT_STATUS.readonly;
    }),
    isShowConfirmBtn: computed(() => {
      return btnStates.currentOpt === OPT_STATUS.complete;
    }),
    startBtnText: computed(() => {
      return btnStates.currentOpt > OPT_STATUS.ready
        ? "重新选取"
        : btnStates.currentOpt == OPT_STATUS.ready
        ? "请选取"
        : "新增span";
    }),
    toolInfo: computed(() => {
      const infos = [
        undefined,
        "请选取要标注的文本片段的开始位置",
        "请选取要标注的文本片段的结束位置",
        "请确定",
        "请开始标注或加入span列表"
      ];
      return infos[+btnStates.currentOpt];
    })
  });

  const select = useSelect(btnStates);

  // 注释模式那几个按钮的handler
  const annotateBtn = {
    // 点击“新增span/重新选取”按钮
    onStartOrReset: (event) => {
      if (btnStates.currentOpt > OPT_STATUS.ready) {
        select.clearSelect(); // 重新标注
      } else {
        // 开始标注
        data.isShowAnnotation = true;
      }
      btnStates.currentOpt = OPT_STATUS.ready;
      forceBlur(event);
    },

    // 点击“确定选取“按钮
    onConfirm: (event) => {
      btnStates.currentOpt += 1;
      forceBlur(event);
    },

    // 点击"结束标注"按钮
    onFinish: () => {
      btnStates.currentOpt = OPT_STATUS.readonly;
      select.clearSelect();
      data.isShowAnnotation = false;
    }
  };

  return {
    OPT_STATUS,
    btnStates,
    spanData,
    annotateBtn,
    ...select
  };
};
