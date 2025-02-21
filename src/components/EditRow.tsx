import React, { useState } from "react";

interface EditRowProps {
    row: any;
    columns: string[];
    onSave: (updatedRow: any) => void;
    onCancel: () => void;
}

const EditRow: React.FC<EditRowProps> = ({ row, columns, onSave, onCancel }) => {
    const [editingRow, setEditingRow] = useState(row);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
        setEditingRow({ ...editingRow, [column]: e.target.value });
    };

    const handleSave = () => {
        onSave(editingRow);
    };

    return (
        <tr>
            {columns.map((column) => (
                <td key={column}>
                    <input
                        type="text"
                        value={editingRow[column]}
                        onChange={(e) => handleChange(e, column)}
                    />
                </td>
            ))}
            <td>
                <button onClick={handleSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </td>
        </tr>
    );
};

export default EditRow;