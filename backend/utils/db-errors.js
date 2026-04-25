function isDuplicateEntryError(error) {
  return error?.code === "ER_DUP_ENTRY";
}

module.exports = {
  isDuplicateEntryError
};
