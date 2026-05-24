import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Intro from './Intro.tsx'
import './index.css'

import {Tallies, AddTally, TallyBoard, RecentlyDeleted} from './pages/index'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
      <Routes>
        <Route path='/' element={<Intro />}/>
        <Route path='/tallies' element={<Tallies/>}/>
        <Route path='/addTally' element={<AddTally/>}/>
        <Route path='/board/:id' element={<TallyBoard/>}/>
        <Route path='/recentlyDeleted' element={<RecentlyDeleted/>}/>
      </Routes>
    </HashRouter>
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
