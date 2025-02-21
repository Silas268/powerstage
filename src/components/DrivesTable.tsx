import React, { useEffect, useState } from "react";
import Table from "./Table";
import CurrentValuesTabTable from "./CurrentValuesTabTable";
import ServoSoftTable from "./ServoSoftTable";
import "../styles/DrivesTable.css";
import search from "../assets/lupe.png";

interface GlobalData {
    typecode: number;
    powerstage_name: string;
    numaxes: number;
    vdcmax: number;
    vdccentertol: number;
    pstfeatures: number;
}

interface AxisData {
    typecode: number;
    inomaxis: number;
    currscale: number;
    interlocktime: number;
    moduletempmax: number;
    iscompthresh: number;
    iscompfreq: number;
    issampling: number;
    cutofffreqdc: number;
}

const DrivesTable: React.FC = () => {
    const [globalData, setGlobalData] = useState<GlobalData[]>([]);
    const [axisData, setAxisData] = useState<AxisData[]>([]);
    const [currentValues, setCurrentValues] = useState<any[]>([]);
    const [dcVoltageCurve, setDcVoltageCurve] = useState<any[]>([]);
    const [temperatureSensorCurve, setTemperatureSensorCurve] = useState<any[]>([]);
    const [servoSoftData, setServoSoftData] = useState<any[]>([]);
    const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
    const [searchTypeCode, setSearchTypeCode] = useState("");

    const [filteredGlobalData, setFilteredGlobalData] = useState<GlobalData[]>([]);
    const [filteredAxisData, setFilteredAxisData] = useState<AxisData[]>([]);
    const [filteredCurrentValues, setFilteredCurrentValues] = useState<any[]>([]);
    const [filteredDcVoltageCurve, setFilteredDcVoltageCurve] = useState<any[]>([]);
    const [filteredTemperatureSensorCurve, setFilteredTemperatureSensorCurve] = useState<any[]>([]);
    const [filteredServoSoftData, setFilteredServoSoftData] = useState<any[]>([]);

    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        globalData: true,
        axisData: true,
        currentValues: true,
        dcVoltageCurve: false,
        temperatureSensorCurve: false,
        servoSoftData: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [globalRes, axisRes, currentValuesRes, dcVoltageCurveRes, temperatureSensorCurveRes, servoSoftRes, descRes] = await Promise.all([
                    fetch("http://localhost:5000/api/globaldata"),
                    fetch("http://localhost:5000/api/axisspecificdata"),
                    fetch("http://localhost:5000/api/currentvalues"),
                    fetch("http://localhost:5000/api/dcvoltagecurve"),
                    fetch("http://localhost:5000/api/temperaturesensorcurve"),
                    fetch("http://localhost:5000/api/servosoft"),
                    fetch("http://localhost:5000/api/descriptions")
                ]);

                setGlobalData(await globalRes.json());
                setAxisData(await axisRes.json());
                setCurrentValues(await currentValuesRes.json());
                setDcVoltageCurve(await dcVoltageCurveRes.json());
                setTemperatureSensorCurve(await temperatureSensorCurveRes.json());
                setServoSoftData(await servoSoftRes.json());

                const descJson = await descRes.json();
                const descriptionMap: { [key: string]: string } = {};
                descJson.forEach((item: { key: string; description: string }) => {
                    descriptionMap[item.key.toLowerCase()] = item.description;
                });
                setDescriptions(descriptionMap);

            } catch (err) {
                console.error("Fehler beim Laden der Daten:", err);
            }
        };

        fetchData();
    }, []);

    const handleSearch = () => {
        setFilteredGlobalData(globalData.filter((item) => item.typecode.toString() === searchTypeCode));
        setFilteredAxisData(axisData.filter((item) => item.typecode.toString() === searchTypeCode));
        setFilteredCurrentValues(currentValues.filter((item) => item.typecode.toString() === searchTypeCode));
        setFilteredDcVoltageCurve(dcVoltageCurve.filter((item) => item.typecode.toString() === searchTypeCode));
        setFilteredTemperatureSensorCurve(temperatureSensorCurve.filter((item) => item.typecode.toString() === searchTypeCode));
        setFilteredServoSoftData(servoSoftData.filter((item) => item.typecode.toString() === searchTypeCode));
    };

    const toggleSection = (section: string) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const handleUpdate = async (updatedRow: any) => {
        try {
            const response = await fetch(`http://localhost:5000/api/globaldata/${updatedRow.typecode}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedRow)
            });

            if (response.ok) {
                const updatedData = await response.json();
                setGlobalData((prevData) =>
                    prevData.map((row) => (row.typecode === updatedData.typecode ? updatedData : row))
                );
                setFilteredGlobalData((prevData) =>
                    prevData.map((row) => (row.typecode === updatedData.typecode ? updatedData : row))
                );
            } else {
                console.error("Failed to update row");
            }
        } catch (err) {
            console.error("Error updating row:", err);
        }
    };

    return (
        <div>
            <div className="drives-table">
                <div className="search-bar">
                    <h2>Endstufe suchen</h2>
                    <input
                        type="text"
                        placeholder="TypeCode eingeben..."
                        value={searchTypeCode}
                        onChange={(e) => setSearchTypeCode(e.target.value)}
                    />
                    <button onClick={handleSearch}>
                        <img src={search} alt="search" />
                    </button>
                </div>

                {filteredGlobalData.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("globalData")}>
                            Global Data {openSections.globalData ? "▲" : "▼"}
                        </button>
                        {openSections.globalData && (
                            <Table data={filteredGlobalData} description={descriptions} onUpdate={handleUpdate} />
                        )}
                    </div>
                )}

                {filteredAxisData.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("axisData")}>
                            Axis Specific Data {openSections.axisData ? "▲" : "▼"}
                        </button>
                        {openSections.axisData && <Table data={filteredAxisData} description={descriptions} onUpdate={handleUpdate} />}
                    </div>
                )}

                {filteredCurrentValues.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("currentValues")}>
                            Current Values {openSections.currentValues ? "▲" : "▼"}
                        </button>
                        {openSections.currentValues && <CurrentValuesTabTable data={filteredCurrentValues} description={descriptions} />}
                    </div>
                )}

                {filteredDcVoltageCurve.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("dcVoltageCurve")}>
                            DC Voltage Curve {openSections.dcVoltageCurve ? "▲" : "▼"}
                        </button>
                        {openSections.dcVoltageCurve && <Table data={filteredDcVoltageCurve} description={descriptions} onUpdate={handleUpdate} />}
                    </div>
                )}

                {filteredTemperatureSensorCurve.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("temperatureSensorCurve")}>
                            Temperature Sensor Curve {openSections.temperatureSensorCurve ? "▲" : "▼"}
                        </button>
                        {openSections.temperatureSensorCurve && <Table data={filteredTemperatureSensorCurve} description={descriptions} onUpdate={handleUpdate} />}
                    </div>
                )}

                {filteredServoSoftData.length > 0 && (
                    <div className="table-section">
                        <button className="dropdown-header" onClick={() => toggleSection("servoSoftData")}>
                            ServoSoft Data {openSections.servoSoftData ? "▲" : "▼"}
                        </button>
                        {openSections.servoSoftData && <ServoSoftTable data={filteredServoSoftData} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrivesTable;