import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Provider } from './components/provider/Provider'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './pages/ProtectedRoute'
import Register from './pages/Register'

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
