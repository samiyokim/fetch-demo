import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './components/Signin'
import View from './components/View'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/view" element={<View />} />
        <Route path="/" element={<Navigate to="/view" replace />} />
      </Routes>
    </Router>
  )
}

export default App
