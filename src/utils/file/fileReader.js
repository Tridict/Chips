const readFileAsText = (fileWrap, options) => {
  const file = fileWrap.obj;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader);
    };
    reader.onerror = reject;

    if (options?.accept && !new RegExp(options?.accept).test(file.type)) {
      reject({
        code: 1,
        msg: "wrong file type",
      });
    }
    if (file.type === "application/json") {
      reader.readAsText(file);
    } else if (!file.type || /^text\//i.test(file.type)) {
      console.log(file.type);
      console.log(fileWrap.encoding);
      // 用于"text/plain"、"text/markdown"、"text/javascript"等
      reader.readAsText(file, fileWrap.encoding);
    } else {
      reader.readAsDataURL(file);
    }
  });
};

async function readFile(file, options) {
  const reader = await readFileAsText(file, options);
  if (typeof reader.result == "string") {
    file.content = reader.result;
  }
  file.hasRead = true;
}

export default readFile;
