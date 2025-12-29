// helpers
const splitPX = (value) => {
  if (!value) return { val: "", unit: "px" };

  const val = value.toString().replace(/[^0-9.]/g, "");
  const unit = value.toString().replace(/[0-9.]/g, "") || "px";

  return { val, unit };
};

export { 
    splitPX
}