import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/pages/Dashboard'
import Homepage from './components/pages/Homepage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default App
