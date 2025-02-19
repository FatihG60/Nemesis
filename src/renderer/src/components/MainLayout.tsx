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
  UserOutlined
} from '@ant-design/icons'
import Dashboard from '../pages/Dashboard'
import FileUpload from '../pages/FileUpload'
import Messaging from '../pages/Messaging'
import PCStatus from '../pages/PCStatus'
import USBDevices from '../pages/USBDevices'

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
        return <Messaging />
      case '4':
        return <PCStatus />
      case '5':
        return <USBDevices />
      default:
        return <Dashboard />
    }
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme={darkMode ? 'dark' : 'light'} collapsible>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UploadOutlined />}>
            Dosya Yükleme
          </Menu.Item>
          <Menu.Item key="3" icon={<MessageOutlined />}>
            Mesajlaşma
          </Menu.Item>
          <Menu.Item key="4" icon={<DesktopOutlined />}>
            PC Durumu
          </Menu.Item>
          <Menu.Item key="5" icon={<UsbOutlined />}>
            USB Aygıtları
          </Menu.Item>
        </Menu>
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
            <Dropdown overlay={userMenu} trigger={['click']}>
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
