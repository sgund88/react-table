import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import columns from "./Colomn";
import {
  useTable,
  useColumnOrder,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Checkbox from "./Checkbox";
import memoizeOne from "memoize-one";

export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="basic-addon1">
        Search:
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={`${count} records...`}
        aria-label="Username"
        aria-describedby="basic-addon1"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{
          fontSize: "1.1rem",
          border: "1",
        }}
      />
    </div>
  );
}

export default function TableDesign() {
  const OriginalData = useSelector((state) => state.allEmployees.employees);
  const [data, setData] = React.useState(() => OriginalData);
  const toggleAllRef = useRef();

  // paggination code start
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  // paggination code end

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 100,
      maxWidth: 400,
    }),
    []
  );

  useEffect(() => {
    setData(OriginalData);
  }, [OriginalData]);

  const _tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => {
      return [
        {
          id: "select",
          headerClassName: "headerSelectBox borderBottom",
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <Checkbox
                ref={toggleAllRef}
                id="select-all"
                onClick={() => handleOnSelectAll()}
                {...getToggleAllRowsSelectedProps()}
              />
            );
          },

          minWidth: 30,
          width: 30,
          maxWidth: 30,
          className: "selectBox",
          Cell: ({ row }) => (
            <Checkbox
              id={`select-${row.original._id}`}
              onClick={() => handleOnSelectRow(row)}
              {...row.getToggleRowSelectedProps()}
            />
          ),
        },

        ...columns,
      ];
    });
  };

  const tableHooks = memoizeOne(_tableHooks);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    visibleColumns,
    state: { pageIndex },
    prepareRow,
    allColumns,
    setColumnOrder,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    useColumnOrder,
    useBlockLayout,
    useResizeColumns,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    tableHooks
  );

  const handleOnSelectRow = (row) => {
    console.log(!row.isSelected ? row.original : "none");
  };

  const handleOnSelectAll = () => {};

  const setColomnorder = () => {
    setColumnOrder(shuffle(visibleColumns.map((d) => d.id)));
  };

  function shuffle(arr) {
    arr = [...arr];
    const shuffled = [];
    while (arr.length) {
      const rand = Math.floor(Math.random() * arr.length);
      shuffled.push(arr.splice(rand, 1)[0]);
    }
    console.log(shuffled);
    return shuffled;
  }

  return (
    <div style={{ margin: "5px" }}>
      <div className="pagination">
        <div className="col col-lg-2">
          <button
            style={{ fontSize: "15px" }}
            onClick={() => setColomnorder({})}
            className="btn btn-secondary"
          >
            Randomize Columns
          </button>
        </div>
        <div className="col">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <p
          style={{
            width: "10%",
            textAlign: "center",
            fontSize: "15px",
            lineHeight: "1.42857",
            marginTop: "7px",
            marginLeft: "50px",
          }}
        >
          {page.length} of {rows.length}
        </p>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          title="previous"
          className="btn btn-light btn-circle"
        >
          {"<"}
        </button>
        <p
          style={{
            width: "5%",
            textAlign: "center",
            fontSize: "15px",
            lineHeight: "1.42857",
            marginTop: "7px",
          }}
        >
          {pageIndex + 1}
        </p>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          title="next"
          className="btn btn-light btn-circle"
          style={{ marginRight: "10px" }}
        >
          {">"}
        </button>
      </div>
      <div className=" table-responsive">
        {rows && (
          <table {...getTableProps()} className="table">
            <thead className="table-dark">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div
                        {...column.getResizerProps()}
                        style={{
                          display: "inline-block",
                          background: "white",
                          width: "5px",
                          height: "100%",
                          position: "absolute",
                          right: 0,
                          top: 0,
                          transform: "translateX(50%)",
                          zIndex: 1,
                          touchAction: "none",
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination">
        {allColumns.map((column) =>
          column.id !== "select" &&
          column.id !== "firstName" &&
          column.id !== "lastName" ? (
            <div
              key={column.id}
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "15px",
                lineHeight: "1.42857",
                marginTop: "7px",
              }}
            >
              <label>
                <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                {column.id}
              </label>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}
