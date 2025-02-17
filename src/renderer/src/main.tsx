import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'antd/dist/reset.css'
import './assets/main.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { ConfigProvider, theme } from 'antd'
import trTR from 'antd/locale/tr_TR'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import FileUpload from './pages/FileUpload'
import Messaging from './pages/Messaging'
import PCStatus from './pages/PCStatus'
import USBDevices from './pages/USBDevices'
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
            {/* Login Sayfası Ayrı Tutuldu */}
            <Route path="/login" element={<LoginForm />} />

            {/* MainLayout ile Korunan Alan */}
            <Route path="/*" element={<MainLayout darkMode={darkMode} toggleTheme={toggleTheme} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="upload" element={<FileUpload />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="pc-status" element={<PCStatus />} />
              <Route path="usb-devices" element={<USBDevices />} />
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootApp />)
