
// 输入：
xx = {
  text: "一个字符串",
  instruction: "@REPLACE",
  annotations: [
    {
      span: [-1,0],
      annotation: {
        to: "试错",
      },
    }, {
      span: [0,0],
      annotation: {
        to: "外面",
      },
    }, {
      span: [0,1],
      annotation: {
        to: "有两",
      },
    }, {
      span: [2,2],
      annotation: {
        to: "好",
      },
    }, {
      span: [2,5],
      annotation: {
        to: "人",
      },
    }, {
      span: [5,5],
      annotation: {
        to: "。",
      },
    }, {
      span: [5,5],
      annotation: {
        to: "来了。",
      },
    }, {
      span: [5,6],
      annotation: {
        to: "哈哈",
      },
    }, {
      span: [-3,9],
      annotation: {
        to: "测试",
      },
    }
  ],
};

// 输出：
yy = {
  text: "一个字符串",
  instruction: "@REPLACE",
  preResult: [
    {
      span: [-1,0],
      note: "@ERROR__SPAN_OUT_OF_SCOPE",
      annotation: {
        to: "试错",
      },
    }, {
      span: [0,0],
      annotation: {
        to: "外面",
      },
    }, {
      span: [0,1],
      orgin: "一",
      annotation: {
        to: "有两",
      },
    }, {
      span: [1,2],
      orgin: "个",
    }, {
      span: [2,2],
      annotation: {
        to: "好",
      },
    }, {
      span: [2,5],
      orgin: "字符串",
      annotation: {
        to: "人",
      },
    }, {
      span: [5,5],
      annotation: {
        to: "。",
      },
    }, {
      span: [5,5],
      annotation: {
        to: "来了。",
      },
    }, {
      span: [5,6],
      note: "@ERROR__SPAN_OUT_OF_SCOPE",
      annotation: {
        to: "哈哈",
      },
    }, {
      span: [-3,9],
      note: "@ERROR__SPAN_OUT_OF_SCOPE",
      annotation: {
        to: "测试",
      },
    }
  ],
  results: [
    ["外面", "有两", "个", "好", "人", "。"],
    ["外面", "有两", "个", "好", "人", "来了。"]
  ],
};