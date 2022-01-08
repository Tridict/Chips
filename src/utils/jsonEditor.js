import { onMounted, ref } from "vue";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

export const useJsonEditor = (initVal) => {
  const jsonEditor = ref(null);
  const jecontainer = ref(null);

  const setJeVal = (val) => {
    jsonEditor.value.set(JSON.parse(val));
  };

  const getJeVal = () => {
    const aa = jsonEditor.value.get();
    console.log(aa);
    return JSON.stringify(aa);
  };

  onMounted(() => {
    const options = {
      modes: ["form", "code", "tree", "view"],
      onModeChange(newMode) {
        if (newMode !== "code") {
          jsonEditor.value?.expandAll();
        }
      }
    };
    jsonEditor.value = new JSONEditor(jecontainer.value, options);
    setJeVal(initVal);
    jsonEditor.value.expandAll();
  });

  return { jecontainer, getJeVal, setJeVal };
};
