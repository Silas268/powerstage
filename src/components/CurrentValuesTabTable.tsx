import React, { useState, useEffect, useMemo } from "react";
import "../styles/CurrentValuesTabTable.css";

interface TableProps {
    data: any[];
    description: { [key: string]: string };
}

const CurrentValuesTabTable: React.FC<TableProps> = ({ data, description }) => {
    const [hoveredType, setHoveredType] = useState<string | null>(null);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    if (!data || data.length === 0) {
        return <p>Keine Daten verfügbar.</p>;
    }

    // Alle einzigartigen Axis-IDs für das Dropdown
    const uniqueAxisIds = [...new Set(data.map((item) => item.axis_id))];
    const [selectedAxisId, setSelectedAxisId] = useState(uniqueAxisIds[0]);

    // Daten filtern nach Achse
    const filteredAxisData = data.filter((item) => item.axis_id === selectedAxisId);

    // Einzigartige current_types für Tabs
    const uniqueCurrentTypes = [...new Set(filteredAxisData.map((item) => item.current_type))];
    const defaultCurrentType = uniqueCurrentTypes.includes("INom") ? "INom" : uniqueCurrentTypes[0];
    const [activeCurrentType, setActiveCurrentType] = useState(defaultCurrentType);

    // Einzigartige VDC-Werte für Tabs
    const uniqueVdcValues = [...new Set(filteredAxisData.filter(item => item.current_type === activeCurrentType).map((item) => item.vdc))];
    const defaultVdc = uniqueVdcValues.includes(327) ? 327 : uniqueVdcValues[0];
    const [activeVdc, setActiveVdc] = useState(defaultVdc);

    useEffect(() => {
        if (!uniqueVdcValues.includes(activeVdc)) {
            setActiveVdc(uniqueVdcValues[0]);
        }
    }, [activeCurrentType, selectedAxisId]);

    // Endgültige Filterung für die Tabelle
    const filteredData = filteredAxisData.filter((item) => item.current_type === activeCurrentType && item.vdc === activeVdc);
    const columns = Object.keys(filteredData[0] || {}).filter(column => column !== "id" && column !== "powerstage_name" && column !== "typecode");

    // Sortierfunktion
    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const valA = a[sortColumn] ?? ""; // Fallback für null oder undefined
            const valB = b[sortColumn] ?? "";

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortColumn, sortOrder]);

    const handleMouseEnter = (type: string, event: React.MouseEvent<HTMLButtonElement>) => {
        setHoveredType(type);
        const rect = event.currentTarget.getBoundingClientRect();

        // Tooltip positioning (bottom center)
        setTooltipStyle({
            position: "absolute",
            top: rect.top + window.scrollY + rect.height -75, // Abstand von 5px
            left: rect.left + window.scrollX + rect.width / 2,
            transform: "translateX(-50%)",
        });
    };

    //For a better readability, format the column names
    //THE NAME OF THE DB_COL must be the same as the key in the description object for example module_temp_max -> ModuleTempMax

    const formatColumnName = (name: string) => {
        return name
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
    };



    const handleSort = (column: string) => {
        setSortOrder(prev => (sortColumn === column && prev === "asc" ? "desc" : "asc"));
        setSortColumn(column);
    };

    return (
        <div className="table-wrapper">
            <div className="tabs-box">
            <div className="tabs">
                {/* Dropdown für die Achsenauswahl */}
                <div className="axis-selector">
                    <select onChange={(e) => setSelectedAxisId(Number(e.target.value))} value={selectedAxisId}>
                        {uniqueAxisIds.map((id) => (
                            <option key={id} value={id}>Axis {id}</option>
                        ))}
                    </select>
                </div>

                {/* VDC Tabs */}
                {uniqueVdcValues.map((vdc) => (
                    <button
                        key={vdc}
                        className={`tab-button ${activeVdc === vdc ? "active" : ""}`}
                        onClick={() => setActiveVdc(vdc)}
                    >
                        {vdc} VDC
                    </button>
                ))}
            </div>

            {/* Current Type Tabs */}
            <div className="tabs">
                {uniqueCurrentTypes.map((type) => (
                    <button
                        key={type}
                        className={`tab-button ${activeCurrentType === type ? "active" : ""}`}
                        onClick={() => setActiveCurrentType(type)}
                        onMouseEnter={(e) => handleMouseEnter(type, e)}
                        onMouseLeave={() => setHoveredType(null)}
                    >
                        {type}
                        {/* Tooltip anzeigen, falls der Typ gehovered wird */}
                        {hoveredType === type && description[type.toLowerCase()] && (
                            <div className="tooltip" style={tooltipStyle}>
                                {description[type.toLowerCase()]}
                            </div>
                        )}
                    </button>
                ))}
            </div>
            </div>

            {/* Tabelle */}
            <table className="table-container">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th onClick={() => handleSort(column)} key={column}>
                            {formatColumnName(column)}
                            {sortColumn === column && (
                                <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((row, index) => (
                    <tr key={index}>
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

export default CurrentValuesTabTable;
