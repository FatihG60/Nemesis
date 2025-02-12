import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css' // Ant Design 5 ve üstü için
import './assets/main.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { ConfigProvider, Layout, Spin, Switch, theme } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import trTR from 'antd/locale/tr_TR'

const { defaultAlgorithm, darkAlgorithm } = theme
const { Header, Content } = Layout

const RootApp = () => {
  const [darkMode, setDarkMode] = useState(false)
  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <Provider store={store}>
      <ConfigProvider
        locale={trTR}
        theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Layout>
            <Header className="flex justify-between items-center">
              <Switch
                checked={darkMode}
                onChange={toggleTheme}
                checkedChildren={
                  <MoonOutlined
                    style={{
                      color: '#fadb14',
                      backgroundColor: '#141414',
                      padding: '5px',
                      borderRadius: '50%'
                    }}
                  />
                }
                unCheckedChildren={
                  <SunOutlined
                    style={{
                      color: '#ffa500',
                      backgroundColor: '#fffbe6',
                      padding: '5px',
                      borderRadius: '50%'
                    }}
                  />
                }
                style={{ background: darkMode ? '#141414' : '#fffbe6' }}
              />
            </Header>
            <Content>
              <Spin spinning={false}>
                <App />
              </Spin>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootApp />)
