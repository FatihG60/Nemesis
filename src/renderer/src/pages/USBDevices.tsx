import React, { useEffect, useState } from 'react';
import { Button, Table, notification } from 'antd';

const UsbDevices: React.FC = () => {
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    window.api.getUsbDrives().then(setDevices).catch((err) => {
      notification.error({ message: 'USB Aygıtları Alınamadı', description: err.message });
    });
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => window.api.getUsbDrives().then(setDevices)}>
        USB Aygıtları Listele
      </Button>
      <Table
        dataSource={devices.map((device, index) => ({ key: index, device }))}
        columns={[{ title: 'USB Depolama Aygıtları', dataIndex: 'device', key: 'device' }]}
      />
    </div>
  );
};

export default UsbDevices;
