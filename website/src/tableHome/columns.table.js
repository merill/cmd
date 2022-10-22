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
    id: "altcommands",
    accessor: "command",
    className: "commands-data-table left",
    Cell: ({ cell: { value }, row: { original } }) => (
      <div style={{ textAlign: "left" }}>
        <a href={`https://cmd.ms/${value}`} target="blank" rel="noreferrer noopener">
          cmd.ms/<b>{value}</b>
        </a>
      </div>
    ),
  },
  {
    Header: "Alternate Command",
    accessor: "command",
    className: "commands-data-table right",
    Cell: ({ cell: { value }, row: { original } }) => (
      <div style={{ textAlign: "right" }}>
        <a href={`https://${value}.cmd.ms`} target="blank" rel="noreferrer noopener">
          <b>{value}</b>.cmd.ms
        </a>
      </div>
    ),
  },
  {
    Header: "Description",
    accessor: "description",
    className: "commands-data-table",
    Cell: ({ cell: { value }, row: { original } }) => (
      <div style={{ textAlign: "left" }}>
        <a href={`${original.url}`} target="blank" rel="noreferrer noopener">
          {value}
        </a>
      </div>
    ),    
  },
  {
    Header: "Alias",
    accessor: "alias",
    className: "commands-data-table left",
  },
  {
    Header: "Category",
    accessor: "category",
    className: "commands-data-table",
    Filter: SelectColumnFilter,
    filter: 'includes',
  },
  {
    Header: "Url",
    accessor: "url",
    className: "commands-data-table",
  },
];
