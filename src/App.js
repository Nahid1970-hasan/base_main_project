import { useState } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import Footer from './components/Navbar&Footer/Footer'
import './components/Navbar&Footer/layout.css'
import Navbar from './components/Navbar&Footer/Navbar'
import SideBar, { findMenuItem } from './components/Navbar&Footer/SideBar'
import AdminDasboard from './pages/AdminDasboard'
import Blogs from './pages/Blogs'
import Icons from './style/Icons'
import Public from './pages/Public'

const AUTH_KEY = 'dibs-auth'

function SectionPage() {
  const { group, item } = useParams()
  if (group === 'icons') return <Icons />
  const match = findMenuItem(group, item)

  return (
    <main className="app">
      <p className="kicker">{match?.group || 'Menu'}</p>
      <h1>{match?.item || 'Page'}</h1>
      <p className="lede">Opened from the sidebar.</p>
    </main>
  )
}

function ProfilePage() {
  return (
    <main className="app">
      <p className="kicker">Account</p>
      <h1>Nahid Hasan</h1>
      <p className="lede">Software Engineer</p>
    </main>
  )
}

function Shell({ onLogout }) {
  const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 860px)').matches)
  const [query, setQuery] = useState('')
  const toggle = () => setCollapsed((open) => !open)

  return (
    <div className="shell">
      {!collapsed && <button type="button" className="sidebar-backdrop" onClick={toggle} aria-label="Close sidebar" />}
      <SideBar collapsed={collapsed} onToggle={toggle} query={query} onLogout={onLogout} />
      <div className="shell-main">
        <Navbar query={query} onQueryChange={setQuery} onToggle={toggle} onLogout={onLogout} />
        <div className="shell-content">
          <Routes>
            <Route path="/" element={<AdminDasboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/:group/:item" element={<SectionPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')

  const login = () => {
    sessionStorage.setItem(AUTH_KEY, '1')
    setAuthed(true)
    window.scrollTo(0, 0)
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
    window.scrollTo(0, 0)
  }

  return (
    <BrowserRouter>
      {authed ? (
        <Shell onLogout={logout} />
      ) : (
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="*" element={<Public onLogin={login} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
