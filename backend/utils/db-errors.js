function isDuplicateEntryError(error) {
  return error?.code === "ER_DUP_ENTRY";
}

function isForeignKeyConstraintError(error) {
  return error?.code === "ER_ROW_IS_REFERENCED_2" ||
    error?.code === "ER_NO_REFERENCED_ROW_2";
}

module.exports = {
  isDuplicateEntryError,
  isForeignKeyConstraintError
};
