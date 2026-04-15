import { useState, useEffect } from 'react'

function ThemeToggle() {
  return (
    <label className="swap swap-rotate fixed top-4 right-4 btn btn-ghost btn-circle">
      <input type="checkbox" className="theme-controller" value="dark" />
      <svg className="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
      <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
  )
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('username')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      setWelcomeUser(savedUser)
    }
  }, [])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleLogin = async () => {
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.code === 0) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('username', username)
        setWelcomeUser(username)
        setSuccessMessage(data.message)
      } else {
        setError(data.message)
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setWelcomeUser(null)
    setUsername('')
    setPassword('')
  }

  if (welcomeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <ThemeToggle />
        {successMessage && (
          <div className="alert alert-success fixed top-4 left-1/2 -translate-x-1/2 w-auto z-50">
            <span>{successMessage}</span>
          </div>
        )}
        <div className="card bg-base-100 shadow-xl w-96 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">欢迎，{welcomeUser}</h1>
          <p className="text-base-content/60 mb-6">您已成功登录</p>
          <button className="btn btn-outline" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <ThemeToggle />
      <div className="card bg-base-100 shadow-xl w-96">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4 justify-center">登录</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">用户名</span>
            </label>
            <input
              type="text"
              placeholder="请输入用户名"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">密码</span>
            </label>
            <input
              type="password"
              placeholder="请输入密码"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="form-control mt-6">
            <button
              className={`btn btn-primary${loading ? ' loading' : ''}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
