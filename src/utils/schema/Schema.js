import { inject, computed, watchEffect, reactive } from "vue";

export class Schema {
  constructor() {
    const json = inject("schema");
    this.updateSchema = inject("updateSchema");
    this.content = reactive({});

    watchEffect(() => {
      const infos = JSON.parse(json.value);
      this.schemaMeta = infos.meta;

      Object.assign(this.content, {
        metaSlots: infos.content.filter((x) => x._type === "Slot"),
        refTag: infos.content.filter((x) => x._type === "RefTag"),
        clueTags: infos.content.filter((x) => x._type === "ClueTag"),
        indTags: infos.content.filter((x) => x._type === "IndTag"),
        indTagAttrs: infos.content.filter((x) => x._type === "IndTagAttr")
      });
    });
  }

  exportToJson() {
    const schema = {
      meta: this.schemaMeta,
      content: [
        ...this.content.metaSlots,
        ...this.content.refTag,
        ...this.content.clueTags,
        ...this.content.indTags,
        ...this.content.indTagAttrs
      ]
    };
    const json = JSON.stringify(schema);
    this.updateSchema(json);
  }

  // 旁批模式
  getMetaSlots() {
    return computed(() => this.content.metaSlots.map((x) => x.key));
  }

  addMetaSlot(key) {
    this.content.metaSlots.push({
      _type: "Slot",
      frame: "CMR_META",
      key
    });
    this.exportToJson();
  }

  // 注释模式
  getRefTags() {
    return computed(() => this.content.refTag.map((x) => x.tagName));
  }

  getClueTags() {
    return computed(() => this.content.clueTags.map((x) => x.tagName));
  }

  addRefTag(tagName) {
    this.content.refTag.push({
      _type: "RefTag",
      tagName
    });
    this.exportToJson();
  }

  addClueTag(tagName) {
    this.content.clueTags.push({
      _type: "ClueTag",
      tagName
    });
    this.exportToJson();
  }

  // 创建-绑定模式
  getIndTags() {
    return computed(() =>
      this.content.indTags.map((x) => {
        return {
          tagName: x.tagName,
          attrs: this.content.indTagAttrs
            .filter((y) => y.parent === x.tagName)
            .map((y) => y.tagName)
        };
      })
    );
  }

  addIndTag(tagName, attrs) {
    this.content.indTags.push({
      _type: "IndTag",
      tagName
    });
    this.content.indTagAttrs = [
      ...this.content.indTagAttrs,
      attrs.map((x) => {
        return {
          _type: "IndTagAttr",
          parent: tagName,
          tagName: x
        };
      })
    ];
    this.exportToJson();
  }
}
