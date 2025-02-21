import React, { useState } from "react";
import "../styles/DrivesTable.css";
import EditRow from "./EditRow";

interface TableProps {
    data: any[];
    description: { [key: string]: string };
    onUpdate: (updatedRow: any) => void;
}

const Table: React.FC<TableProps> = ({ data: initialData, description, onUpdate }) => {
    const [data, setData] = useState(initialData);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return <p>Keine Daten verfügbar.</p>;
    }

    const formatColumnName = (name: string) => {
        return name
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
    };

    const columns = Object.keys(data[0]).filter(column => column !== "typecode" && column !== "id");

    const handleSort = (column: string) => {
        const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };

    let sortedData = [...data];
    if (sortColumn) {
        sortedData.sort((a: any, b: any) => {
            if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }

    const handleEdit = (rowId: number) => {
        setEditingRowId(rowId);
    };

    const handleSave = (updatedRow: any) => {
        onUpdate(updatedRow);
        setEditingRowId(null);
    };

    const handleCancel = () => {
        setEditingRowId(null);
    };

    return (
        <div>
        <table className="table-container">
            <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={column}
                        onClick={() => handleSort(column)}
                        onMouseEnter={() => setHoveredColumn(column)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        className="table-header"
                        style={{ cursor: "pointer" }}
                    >
                        {formatColumnName(column)}
                        {sortColumn === column && <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>}
                        {hoveredColumn === column && description[column] && (
                            <div className="tooltip">{description[column]}</div>
                        )}
                    </th>
                ))}
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((row, index) => (
                <React.Fragment key={index}>
                    {editingRowId === row.id ? (
                        <EditRow
                            row={row}
                            columns={columns}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <tr>
                            {columns.map((column) => (
                                <td key={column}>{row[column]}</td>
                            ))}
                            <td>
                                <button onClick={() => handleEdit(row.id)}>Edit</button>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
            </tbody>
        </table>
</div>
);
};

export default Table;