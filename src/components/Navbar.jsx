import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MJ</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {/* <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link> */}
      </div>
    </nav>
  )
}

export default Navbar