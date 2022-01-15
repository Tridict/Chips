import { onMounted, ref, watchEffect } from "vue";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

export const useJsonEditor = (initVal, options) => {
  const jsonEditor = ref(null);
  const jecontainer = ref(null);

  const setJeVal = (val) => {
    if (typeof val === "string") {
      jsonEditor.value.set(JSON.parse(val));
    } else {
      jsonEditor.value.set(val);
    }
    jsonEditor.value.expandAll();
  };

  const getJeVal = () => {
    const aa = jsonEditor.value.get();
    console.log(aa);
    return JSON.stringify(aa);
  };

  watchEffect(() => {
    if (initVal.value && jsonEditor.value) {
      setJeVal(initVal.value);
    }
  });

  onMounted(() => {
    jsonEditor.value = new JSONEditor(jecontainer.value, {
      ...options,
      onModeChange(newMode) {
        if (newMode !== "code") {
          jsonEditor.value?.expandAll();
        }
      }
    });
    setJeVal(initVal.value);
  });

  return { jecontainer, getJeVal, setJeVal };
};
