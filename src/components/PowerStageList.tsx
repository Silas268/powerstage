import React from "react";

interface PowerStageListProps {
    powerStages: string[];
}

const PowerStageList: React.FC<PowerStageListProps> = ({ powerStages }) => {
    return (
        <div className="power-stage-list">
            <h2>Verfügbare Endstufen</h2>
            <ul>
                {powerStages.map((stage, index) => (
                    <li key={index}>{stage}</li>
                ))}
            </ul>
        </div>
    );
};

export default PowerStageList;