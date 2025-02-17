import { Layout, Menu, Switch } from 'antd'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  UploadOutlined,
  MessageOutlined,
  DesktopOutlined,
  UsbOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '1', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
  { key: '2', icon: <UploadOutlined />, label: <Link to="/upload">Dosya Yükleme</Link> },
  { key: '3', icon: <MessageOutlined />, label: <Link to="/messaging">Mesajlaşma</Link> },
  { key: '4', icon: <DesktopOutlined />, label: <Link to="/pc-status">PC Durumu</Link> },
  { key: '5', icon: <UsbOutlined />, label: <Link to="/usb-devices">USB Aygıtları</Link> }
]

const MainLayout = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme={darkMode ? 'dark' : 'light'} collapsible>
        <Menu theme={darkMode ? 'dark' : 'light'} mode="inline" items={menuItems} />
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
            <LogoutOutlined
              onClick={handleLogout}
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                color: darkMode ? '#ffffff' : '#000000'
              }}
            />
          </div>
        </Header>
        <Content style={{ padding: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
