import { ref, provide, readonly } from "vue";

export const useAnnotation = () => {
  // todo: 读取自文件的数据
  const sentenceList = ref([
    {
      id: 0,
      text: "这是第一句的内容，算是body部分。一个字符串...",
      annotations: [
        {
          content: {
            key: "todo",
            value: "111",
          },
          _tagMode: "meta",
          _id: 0,
        },
        {
          content: {
            key: "todo",
            value: "222",
          },
          _tagMode: "meta",
          _id: 1,
        },
        {
          _tagMode: "CC",
          _tag: "StartPoint",
          trigger: "#1",
          concretization: "#0",
          _id: 2,
        },
      ],
    },
    {
      id: 1,
      text: "一个字符串",
      annotations: [],
    },
  ]);

  const addAnnotation = pars => {
    if (sentenceList.value[pars.id]?.annotations) {
      sentenceList.value[pars.id].annotations.push({
        ...pars.annotation,
        _id: sentenceList.value[pars.id].annotations.length,
      });
      console.log(sentenceList.value);
    } else {
      console.log("没有找到对应的句子");
      console.log(pars);
    }
  };

  const onReadAnnotation = fileContents => {
    const content = fileContents.value[0]?.content;
    let arr = [];
    try {
      arr = JSON.parse(content);
    } catch (error) {
      arr = content.split("\n");
    }
    sentenceList.value = []; // 覆盖原有内容
    arr.forEach((x, i) => {
      sentenceList.value.push({
        id: i,
        text: typeof x === "string" ? x : x.text,
        annotations: x.annotations || [],
      });
    });
  };

  provide("sentenceList", readonly(sentenceList));
  provide("addAnnotation", addAnnotation);
  provide("onReadAnnotation", onReadAnnotation);

  return { sentenceList, addAnnotation, onReadAnnotation };
};
