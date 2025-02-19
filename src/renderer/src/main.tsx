import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import 'antd/dist/reset.css'
import './assets/main.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { ConfigProvider, theme } from 'antd'
import trTR from 'antd/locale/tr_TR'
import MainLayout from './components/MainLayout'
import LoginForm from './pages/Login'

const { defaultAlgorithm, darkAlgorithm } = theme

const RootApp = () => {
  const [darkMode, setDarkMode] = useState(false)
  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <Provider store={store}>
      <ConfigProvider
        locale={trTR}
        theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route
              path="/main"
              element={<MainLayout darkMode={darkMode} toggleTheme={toggleTheme} />}
            ></Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootApp />)
