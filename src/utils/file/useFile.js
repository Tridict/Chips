import readFile from "./fileReader";
import { ref } from "vue";
// import { Notify } from 'vant'

// 提供fileMetaList
const useFile = () => {
  const fileMetaList = ref([]);
  const onImportFiles = async (file) => {
    // 默认的input框处理
    if (file instanceof FileList) {
      await readFileLists(file, fileMetaList.value);
    }
  };
  const onDropFile = async (event) => {
    event.preventDefault();

    if (event.type == "drop") {
      const fileList = event.dataTransfer?.files;
      if (fileList) {
        await readFileLists(fileList, fileMetaList.value);
        return true;
      }
    }
    return false;
  };
  const onRemoveFile = (idx) => {
    fileMetaList.value.splice(idx, 1);
  };

  return { fileMetaList, onImportFiles, onDropFile, onRemoveFile };
};

const readFileLists = async (fileList, fileMetaList) => {
  let files = [];
  if (fileList instanceof File) {
    files = [fileList];
  } else {
    files = fileList;
  }
  // 把文件保存为对象
  for (const file of files) {
    if (fileMetaList.map((f) => f.name).includes(file.name)) {
      // Notify(`文件【${file.name}】重复。`)
      console.log(`文件【${file.name}】重复。`);
    } else {
      // 用一个对象保存文件的meta信息
      fileMetaList.unshift({
        obj: file,
        name: file.name,
        hasRead: false,
        encodingGot: false,
        encoding: "utf-8"
      });
    }
  }
  // 读取文件内容
  for (const file of fileMetaList) {
    if (file.hasRead) continue;
    try {
      await readFile(file);
      // Notify({ type: 'success', message: `文件读取成功`, duration: 1000 })
      console.log(`文件读取成功`);
    } catch (error) {
      console.log(error);
      // Notify({ type: 'warning', message: `${error}`, duration: 5000 })
    }
  }
};

export default useFile;
