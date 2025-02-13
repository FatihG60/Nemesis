import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css';
import './assets/main.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider, theme } from 'antd';
import trTR from 'antd/locale/tr_TR';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Messaging from './pages/Messaging';
import PCStatus from './pages/PCStatus';
import USBDevices from './pages/USBDevices';

const { defaultAlgorithm, darkAlgorithm } = theme;

const RootApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Provider store={store}>
      <ConfigProvider locale={trTR} theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}>
        <Router>
          <MainLayout darkMode={darkMode} toggleTheme={toggleTheme}>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/upload' element={<FileUpload />} />
              <Route path='/messaging' element={<Messaging />} />
              <Route path='/pc-status' element={<PCStatus />} />
              <Route path='/usb-devices' element={<USBDevices />} />
            </Routes>
          </MainLayout>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootApp />);
