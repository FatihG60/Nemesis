import { useState, useEffect } from 'react'
import { Layout, Menu, Switch, Dropdown, Tooltip, Avatar } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UploadOutlined,
  MessageOutlined,
  DesktopOutlined,
  UsbOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  UserOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import Dashboard from '../pages/Dashboard'
import FileUpload from '../pages/FileUpload'
import Messaging from '../pages/Messaging'
import PCStatus from '../pages/PCStatus'
import USBDevices from '../pages/USBDevices'
import FileDownload from '../pages/FileDownload'

const { Header, Sider, Content } = Layout

const MainLayout = ({ darkMode, toggleTheme }) => {
  const [selectedKey, setSelectedKey] = useState<string>('1')
  const navigate = useNavigate()
  const location = useLocation()
  const userName = location.state?.user || null

  useEffect(() => {
    if (!userName) {
      navigate('/')
    }
  }, [userName, navigate])

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key)
  }

  const handleLogout = () => {
    navigate('/', { replace: true, state: null })
  }

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Dashboard />
      case '2':
        return <FileUpload />
      case '3':
        return <FileDownload />
      case '4':
        return <Messaging />
      case '5':
        return <PCStatus />
      case '6':
        return <USBDevices />
      default:
        return <Dashboard />
    }
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      onClick: handleLogout
    }
  ]
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UploadOutlined />, label: 'Dosya Yükleme' },
    { key: '3', icon: <DownloadOutlined />, label: 'Dosya İndirme' },
    { key: '4', icon: <MessageOutlined />, label: 'Mesajlaşma' },
    { key: '5', icon: <DesktopOutlined />, label: 'PC Durumu' },
    { key: '6', icon: <UsbOutlined />, label: 'USB Aygıtları' }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme={darkMode ? 'dark' : 'light'} collapsible>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
            background: darkMode ? '#141414' : '#ffffff'
          }}
        >
          <h1 style={{ color: darkMode ? '#ffffff' : '#000000' }}>FTS</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined style={{ color: '#fadb14' }} />}
              unCheckedChildren={<SunOutlined style={{ color: '#ffa500' }} />}
            />
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Tooltip title={userName}>
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              </Tooltip>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: '16px' }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
