export default function TableBody({ tableColumns, tableData, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="table bg-white">
        <thead className="">
          <tr>
            <th>#</th>
            {tableColumns.map((header) => (
              <th key={header.uid} className="text-md font-bold">
                {header.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={item._id} className="hover:bg-base-300 border-gray-300">
                <td>{index + 1}</td>
                {tableColumns.map((header) => (
                  <td key={header.uid}>
                    {renderCell ? renderCell(item, header.uid) : ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableColumns.length + 1}
                className="h-24 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}