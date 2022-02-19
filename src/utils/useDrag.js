export const useDrag = handleSelect => {
  let isSelecting = false;
  let start = "";
  let tmp = "";

  const onDragItem = (elName, progress) => {
    if (!elName) return;
    const [id, type] = elName.split(",");
    handleSelect(+id, type, progress);
  };

  function dragDown(event) {
    isSelecting = true;
    const e = event || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    if (elName) {
      onDragItem(elName, "start");
      start = elName;
    }
    return false;
  }

  function dragMove(event) {
    if (!isSelecting) {
      return;
    }
    const e = event || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    if (elName && elName !== start && elName !== tmp) {
      onDragItem(elName, "hover");
    }
    if (!elName) {
      // 没在文字上移动...
      console.log('move out?');
    }
  }

  function dragUp(event) {
    isSelecting = false;
    const e = event || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    console.log("up on", elName);
    if (start !== elName) {
      onDragItem(elName, "end");
    } else {
      handleSelect(0, "", "startAndEnd");
    }
    start = "";
    // console.log("end");
  }

  function dragOut(event) {
    const e = event || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    return elName;
    // console.log(elName);
  }

  return { dragDown, dragMove, dragUp, dragOut };
};
