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

function ShortcutsOverlay({ onClose }) {
  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="shortcuts-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <table className="shortcuts-table">
          <tbody>
            <tr><td><kbd>/</kbd></td><td>Focus search box</td></tr>
            <tr><td><kbd>↓</kbd> / <kbd>↑</kbd></td><td>Navigate table rows</td></tr>
            <tr><td><kbd>Enter</kbd></td><td>Open selected row link</td></tr>
            <tr><td><kbd>Alt</kbd> + <kbd>Enter</kbd></td><td>Open first row link</td></tr>
            <tr><td><kbd>`</kbd></td><td>Toggle dark / light mode</td></tr>
            <tr><td><kbd>?</kbd></td><td>Show this help</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// our commands specific react-table
const CommandsDataTable = ({
  columns,
  data,
  applyFilter = '',
  initialSearch = '',
  columnsToHide = [''],
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = React.useState(-1);
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const searchInputRef = React.useRef(null);
  const tableBodyRef = React.useRef(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      applyFilter,
      columnsToHide,
       initialState: { 
        hiddenColumns: columnsToHide.concat(['keywords']),
        globalFilter: initialSearch || undefined,
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
    useSortBy,
  );

  // Reset selection when rows change (e.g. after filtering)
  React.useEffect(() => {
    setSelectedRowIndex(-1);
  }, [rows.length]);

  // Scroll selected row into view
  React.useEffect(() => {
    if (selectedRowIndex >= 0 && tableBodyRef.current) {
      const row = tableBodyRef.current.querySelectorAll('tr')[selectedRowIndex];
      if (row) row.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedRowIndex]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Shift+? — toggle shortcuts overlay (works everywhere)
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      // ` — toggle dark/light mode (not when typing in input)
      if (e.key === '`' && !isInput && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        return;
      }

      // Esc — close overlay or clear search or clear selection
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (isInput) {
          // Clear the search box and filter
          setGlobalFilter(undefined);
          if (searchInputRef.current) searchInputRef.current.value = '';
          document.activeElement.blur();
          setSelectedRowIndex(-1);
        } else {
          setSelectedRowIndex(-1);
        }
        return;
      }

      // ArrowDown — works inside search box too
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isInput) document.activeElement.blur();
        setSelectedRowIndex((prev) => Math.min(prev + 1, rows.length - 1));
        return;
      }

      // ArrowUp — works inside search box too
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isInput) document.activeElement.blur();
        setSelectedRowIndex((prev) => {
          if (prev <= 0) {
            searchInputRef.current?.focus();
            return -1;
          }
          return prev - 1;
        });
        return;
      }

      // Handle remaining input-specific shortcuts
      if (isInput) {
        // Alt+Enter from search box still opens first link
        if (e.altKey && e.key === 'Enter' && rows.length > 0) {
          e.preventDefault();
          const url = rows[0].values.url;
          if (url) window.open(url, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      // / — focus search box
      if (e.key === '/' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Alt+Enter — open first row
      if (e.altKey && e.key === 'Enter' && rows.length > 0) {
        e.preventDefault();
        const url = rows[0].values.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      // Enter — open selected row
      if (e.key === 'Enter' && selectedRowIndex >= 0 && selectedRowIndex < rows.length) {
        e.preventDefault();
        const url = rows[selectedRowIndex].values.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      // Any printable character — focus search box and let the keystroke through
      if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        searchInputRef.current?.focus();
        return;
      }


    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [rows, selectedRowIndex, showShortcuts]);

  // Render the UI for your table
  return (
    <>
      {showShortcuts && <ShortcutsOverlay onClose={() => setShowShortcuts(false)} />}
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
          initialSearch={initialSearch}
          inputRef={searchInputRef}
        />
      </div>

          <div className="py-2 ">
            <div className="overflow-hidden">
              <table
                {...getTableProps()}
                className="w-full divide-y divide-gray-200 table-fixed"
              >
                <thead className="">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          scope="col"
                          className="group px-6 py-2 text-left text-xs font-medium uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render("Header")}
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
                  ref={tableBodyRef}
                >
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${i === selectedRowIndex ? 'row-selected' : ''}`}
                        onClick={() => setSelectedRowIndex(i)}
                        {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps({
                                className: cell.column.className
                              })}                              
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
    </>
  );
};

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  applyFilter,
  initialSearch = '',
  inputRef,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter || initialSearch);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 1);

  // Sync local value when globalFilter is cleared externally (e.g. Esc)
  React.useEffect(() => {
    if (globalFilter === undefined) setValue('');
  }, [globalFilter]);

  return (
    <label className={`flex items-baseline w-96 ${applyFilter.length === 0 ? "gap-x-2" : ""}`} >
      <span></span>
      <input
        type="text"
        autoFocus
        ref={inputRef}
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
