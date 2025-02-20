import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Guestbook from './pages/Guestbook'
import AdminPost from './pages/AdminPost'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guestbook" element={<Guestbook />} />
            <Route path="/admin/post" element={<AdminPost />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 