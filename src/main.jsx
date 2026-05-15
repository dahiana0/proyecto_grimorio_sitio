import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import { AppMain } from './AppMain.jsx'
createRoot(document.getElementById("root")).render(
  <StrictMode>
<<<<<<< HEAD
    {/* <App />  */}
    <AppMain/>
  </StrictMode>,z
)
=======
    <App />
    {/* <AppMain/>*/}
  </StrictMode>,
);
>>>>>>> 8b22931c96020dc3419e36c565967fbdc7b7e80d
