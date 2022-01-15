export const useDrag = (handleSelect) => {
  var bMouseUp = true;
  let start = "";
  let tmp = "";

  const onDragItem = (elName) => {
    if (!elName) return;
    const [id, type] = elName.split(",");
    handleSelect(+id, type);
  };

  function dragDown(oPssEvt1) {
    const e = oPssEvt1 || /* IE */ window.event;
    bMouseUp = false;
    // console.log("start");
    const elName = e?.target?.getAttribute("name");
    if (elName) {
      onDragItem(elName);
      start = elName;
    }
    return false;
  }

  function dragMove(oPssEvt2) {
    if (bMouseUp) {
      return;
    }
    const e = oPssEvt2 || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    if (elName && elName !== start && elName !== tmp) {
      tmp = elName;
      console.log(tmp);
    }
  }

  function dragUp(oPssEvt3) {
    bMouseUp = true;
    const e = oPssEvt3 || /* IE */ window.event;
    const elName = e?.target?.getAttribute("name");
    if (start !== elName) {
      onDragItem(elName);
    }
    start = "";
    // console.log("end");
  }

  return { dragDown, dragMove, dragUp };
};
