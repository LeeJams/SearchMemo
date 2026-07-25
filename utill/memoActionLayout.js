const DEFAULT_ACTION_GRID_COLUMNS = 3;

function buildActionGridRows(
  options,
  columnCount = DEFAULT_ACTION_GRID_COLUMNS
) {
  if (!Array.isArray(options) || options.length === 0) {
    return [];
  }

  const columns =
    Number.isInteger(columnCount) && columnCount > 0
      ? columnCount
      : DEFAULT_ACTION_GRID_COLUMNS;
  const rows = [];

  for (let index = 0; index < options.length; index += columns) {
    const row = options.slice(index, index + columns);
    while (row.length < columns) {
      row.push(null);
    }
    rows.push(row);
  }

  return rows;
}

module.exports = {
  DEFAULT_ACTION_GRID_COLUMNS,
  buildActionGridRows,
};
