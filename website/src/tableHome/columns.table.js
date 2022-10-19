import React from "react";

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <select
        className="mt-1 block rounded-md border-gray-300  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  dark:bg-zinc-800 dark:border-gray-700"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All Microsoft Portals</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export const columns = [
  {
    Header: "Command",
    accessor: "command",
    className: "command-data-table left",
    Cell: ({ cell: { value }, row: { original } }) => (
      <a href={`${original.url}`} target="blank" rel="noreferrer noopener">
        {value}
      </a>
    ),
  },
  {
    Header: "Alias",
    accessor: "alias",
    className: "command-data-table left",
  },
  {
    Header: "Description",
    accessor: "description",
    className: "command-data-table",
  },
  {
    Header: "Category",
    accessor: "category",
    className: "command-data-table",
    Filter: SelectColumnFilter,
    filter: 'includes',
  },
];
