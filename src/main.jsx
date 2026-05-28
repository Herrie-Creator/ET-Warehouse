import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import WarehouseDisplay from './WarehouseDisplay.jsx'

const isWarehouse = window.location.pathname === '/warehouse'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isWarehouse ? <WarehouseDisplay /> : <App />}
  </StrictMode>,
)
