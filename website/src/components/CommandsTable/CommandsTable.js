// ----------------------------------------------------------------------------
// Please note that this component is deliberately NOT using a CCS stylesheet
// because react-table is ui-agnostic and the table will therefore inherit
// Docusaurus table styling. If additional styling ever becomes required please
// consider using either "css modules" or "styled components".
//
// ----------------------------------------------------------------------------
import React from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
} from "react-table";
import "regenerator-runtime";
import { CommandsTable } from ".";
import "./style.css";
import { SortIcon, SortDownIcon, SortUpIcon } from "../../shared/icons";

// create a default prop getter
const defaultPropGetter = () => ({});

// our commands specific react-table
const CommandsDataTable = ({
  columns,
  data,
  applyFilter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state, // new
    preGlobalFilteredRows, // new
    setGlobalFilter, // new
  } = useTable(
    {
      columns,
      data,
      applyFilter,
       initialState: { 
        hiddenColumns: ["url"],
        filters: [
          {
            id: 'category',
            value: applyFilter
          }
        ]
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  // Render the UI for your table
  return (
    <>
      <div className="flex gap-x-2">
          {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) =>
              column.Filter && applyFilter.length === 0 ? (
                <div key={column.id}>{column.render("Filter")}</div>
              ) : null
            )
          )
          }
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          applyFilter={applyFilter}
        />
      </div>

      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render("Header")}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="divide-y divide-gray-200"
                >
                  {rows.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-2 whitespace-nowrap"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  applyFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 1);

  return (
    <label className={`flex items-baseline w-96 ${applyFilter.length === 0 ? "gap-x-2" : ""}`} >
      <span></span>
      <input
        type="text"
        autoFocus
        class="mt-1 block w-full rounded-md border-gray-300  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-zinc-800 dark:border-gray-700 searchbox"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search commands...`}
      />
    </label>
  );
}

export default CommandsDataTable;