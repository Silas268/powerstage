import React from "react";


interface TableProps {
    data: any[];
}

const ServoSoftTable: React.FC<TableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    // Groups of columns to be displayed together
    const groupedColumns = {
        "Produktdaten": ["model", "exclude", "product_source_type", "legacy_type", "display_type", "image_id", "combined_product_type", "cmax_value", "bus_typ", "eff_inv", "lf_typ"],
        "Temperaturwerte": ["p0_t_temp", "p1_t_temp", "p2_t_temp", "p3_t_temp", "p4_t_temp"],
        "LF-Werte": ["p0_t_lf", "p1_t_lf", "p2_t_lf", "p3_t_lf", "p4_t_lf"],
        "Elevationswerte": ["p0_e_elev", "p1_e_elev", "p2_e_elev", "p3_e_elev", "p4_e_elev"],
    };

    const formatColumnName = (name: string) => {
        return name
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
    };

    //A table with columns grouped by context to improve readability

    return (
        <div className="table-wrapper">
            {Object.entries(groupedColumns).map(([groupName, columns]) => (
                <div key={groupName} className="table-group">
                    <h4>{groupName}</h4>

                    <table className="table-container">
                        <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column}>{formatColumnName(column)}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column) => (
                                    <td key={column}>{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            ))}
        </div>
    );
};

export default ServoSoftTable;
