import React, { useState } from "react";
import "../styles/DrivesTable.css";

interface TableProps {
    data: any[];
    description: { [key: string]: string };
}

const Table: React.FC<TableProps> = ({ data: initialData, description }) => {
    const [data, setData] = useState(initialData);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

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

    const handleRowClick = (row: any) => {
        setSelectedRow(row);
    };

    const handleSave = async (updatedRow: any) => {
        try {
            const response = await fetch(`/api/globalData/${updatedRow.TypeCode}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRow),
            });

            if (!response.ok) throw new Error("Fehler beim Speichern!");

            const updatedData = await response.json();

            setData((prevData) =>
                prevData.map((row) => (row.TypeCode === updatedData.TypeCode ? updatedData : row))
            );
            setSelectedRow(null);
        } catch (error) {
            console.error("Update fehlgeschlagen:", error);
        }
    };

    return (
        <div className="table-wrapper">
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
                </tr>
                </thead>
                <tbody>
                {sortedData.map((row, index) => (
                    <tr key={index} onClick={() => handleRowClick(row)}>
                        {columns.map((column) => (
                            <td key={column}>{row[column]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>


        </div>
    );
};

export default Table;
