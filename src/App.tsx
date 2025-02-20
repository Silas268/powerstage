import { useState } from 'react'
import React from 'react'
import Header from "./components/Header";

import DrivesTable from "./components/DrivesTable";


function App() {
  return (
    <div className="App">
      <header>
          <Header />
      </header>
        <div className= "table-container">
            <DrivesTable />
        </div>
    </div>
  )
}

export default App
