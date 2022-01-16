// 点击按钮后手动失焦
export const forceBlur = event => {
  let target = event.target;
  if (target.parentNode.className.split(/\s+/).includes("el-button")) {
    target = target.parentNode;
  }
  target.blur();
};
