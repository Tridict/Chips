<template>
  <NavBar />
  <UploadBox @onRead="onReadAnnotation" />
  <DownloadBtn filename="schema.json" :content="schema" btnText="导出schema" />
  <DownloadBtn
    filename="annotation.json"
    :content="sentenceList"
    btnText="导出annotation"
  />
  <main class="container">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="tab == TABS.annotation ? 'active' : ''"
          href="#"
          @click="tab = TABS.annotation"
        >
          标注
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="tab == TABS.schema ? 'active' : ''"
          href="#"
          @click="tab = TABS.schema"
        >
          管理 Schema
        </a>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link disabled">Disabled</a>
      </li> -->
    </ul>

    <Annotation v-if="tab == TABS.annotation" />
    <Schema v-if="tab == TABS.schema" />
  </main>
</template>

<script>
import { ref } from "vue";
import Annotation from "@/pages/Annotation/index.vue";
import Schema from "@/pages/Schema/index.vue";
import { useSchema } from "@/utils/schema/useSchema.js";
import { useAnnotation } from "@/utils/Annotation/useAnnotation.js";
import NavBar from "@/components/NavBar.vue";
import UploadBox from "./components/uploadBox.vue";
import DownloadBtn from "./components/downloadBtn.vue";

const TABS = {
  annotation: Symbol(),
  schema: Symbol()
};

export default {
  components: { Annotation, Schema, NavBar, UploadBox, DownloadBtn },
  name: "App",
  setup() {
    const tab = ref(TABS.annotation);

    const { schema } = useSchema();
    const { sentenceList } = useAnnotation();

    const onReadAnnotation = (fileContents) => {
      const content = fileContents.value[0]?.content;
      sentenceList.value = JSON.parse(content);
    };

    return { schema, sentenceList, onReadAnnotation, tab, TABS };
  }
};
</script>
