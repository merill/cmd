import React from "react";

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
  },
];
