import React from 'react';
import { Form, Input, Button, Card, message, App } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage(); // `message` için `useMessage` kullan

  const onFinish = (values: { username: string; password: string }) => {
    if (values.username === 'admin' && values.password === 'password') {
      messageApi.success('Giriş başarılı!'); // Artık `messageApi` ile çağırıyoruz
      navigate('/main', { state: { user: values.username } });
    } else {
      messageApi.error('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <App>
      {contextHolder} {/* Message için context sağlayıcı ekleniyor */}
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-4">Giriş Yap</h2>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Kullanıcı Adı"
              name="username"
              rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
            </Form.Item>

            <Form.Item
              label="Parola"
              name="password"
              rules={[{ required: true, message: 'Lütfen parolanızı girin!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Parola" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </App>
  );
};

export default LoginForm;
