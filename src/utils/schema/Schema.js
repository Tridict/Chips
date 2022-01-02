import { inject, computed } from "vue";

export class Schema {
  constructor() {
    const json = inject("schema");
    this.updateSchema = inject("updateSchema");
    const infos = JSON.parse(json.value);
    this.schemaMeta = infos.meta;

    this.content = computed(() => {
      return {
        metaSlots: infos.content.filter((x) => x._type === "Slot"),
        refTag: infos.content.filter((x) => x._type === "RefTag"),
        clueTags: infos.content.filter((x) => x._type === "ClueTag"),
        indTags: infos.content.filter((x) => x._type === "IndTag"),
        indTagAttrs: infos.content.filter((x) => x._type === "IndTagAttr")
      };
    });
  }

  exportToJson() {
    const schema = {
      meta: this.schemaMeta,
      content: [
        ...this.content.value.metaSlots,
        ...this.content.value.refTag,
        ...this.content.value.clueTags,
        ...this.content.value.indTags,
        ...this.content.value.indTagAttrs
      ]
    };
    console.log(schema)
    const json = JSON.stringify(schema);
    this.updateSchema(json);
  }

  // 旁批模式
  getMetaSlots() {
    return computed(() => this.content.value.metaSlots.map((x) => x.key));
  }

  addMetaSlot(key) {
    this.content.value.metaSlots.push({
      _type: "Slot",
      frame: "CMR_META",
      key
    });
    this.exportToJson();
  }

  // 注释模式
  getRefTags() {
    return computed(() => this.content.value.refTag.map((x) => x.tagName));
  }

  getClueTags() {
    return computed(() => this.content.value.clueTags.map((x) => x.tagName));
  }

  addRefTag(tagName) {
    this.content.value.refTag.push({
      _type: "RefTag",
      tagName
    });
    this.exportToJson();
  }

  addClueTag(tagName) {
    this.content.value.clueTags.push({
      _type: "ClueTag",
      tagName
    });
    this.exportToJson();
  }

  // 创建-绑定模式
  getIndTags() {
    return computed(() =>
      this.content.value.indTags.map((x) => {
        return {
          tagName: x.tagName,
          attrs: this.content.value.indTagAttrs
            .filter((x) => x.parent === x.tagName)
            .map((x) => x.tagName)
        };
      })
    );
  }

  addIndTag(tagName, attrs) {
    this.content.value.indTags.push({
      _type: "IndTag",
      tagName
    });
    this.content.value.indTagAttrs = [
      ...this.content.value.indTagAttrs,
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
