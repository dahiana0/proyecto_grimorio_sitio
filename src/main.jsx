import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import { AppMain } from './AppMain.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App />  */}
    <AppMain/>
  </StrictMode>,
)
