import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
      const [username, setUsername] = useState('') 
      const [password, setPassword] = useState('')

      const handleSubmit = async (event) => {
            event.preventDefault()
            await onLogin({ username, password})
            setUsername('')
            setPassword('')
      }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username-input'>Username
          </label>
          <input
            id='username-input'
            value={username}
            onChange={event => setUsername(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor='password-input'>Password</label>
          <input
            id='password-input'
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
          />
      </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm