import React, { useState } from 'react';
import { Table, Button, Input, Space, Progress, List, Badge, Popover } from 'antd';
import { DownloadOutlined, SearchOutlined, CloseOutlined, InboxOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface FileData {
  key: string;
  name: string;
  size: string;
  date: string;
  url: string;
}

interface DownloadTask {
  key: string;
  name: string;
  progress: number;
  cancel: () => void;
}

const FileDownload: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);

  const columns: ColumnsType<FileData> = [
    {
      title: 'Dosya Adı',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : [],
      onFilter: (value, record) => record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Dosya Boyutu',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) => parseFloat(a.size) - parseFloat(b.size),
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
  ];

  const data: FileData[] = [
    {
      key: '1',
      name: 'document1.pdf',
      size: '2.4 MB',
      date: '2024-02-12',
      url: '/path/to/document1.pdf',
    },
    {
      key: '2',
      name: 'image1.png',
      size: '1.2 MB',
      date: '2024-02-10',
      url: '/path/to/image1.png',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  };

  const handleDownload = () => {
    const selectedFiles = data.filter((file) => selectedRowKeys.includes(file.key));
    setSelectedRowKeys([]);
    selectedFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setDownloads((prev) =>
          prev.map((task) => (task.key === file.key ? { ...task, progress } : task))
        );
        if (progress >= 100) {
          clearInterval(interval);
          setDownloads((prev) => prev.filter((task) => task.key !== file.key));
        }
      }, 500);

      setDownloads((prev) => [
        ...prev,
        {
          key: file.key,
          name: file.name,
          progress: 0,
          cancel: () => clearInterval(interval),
        },
      ]);
    });
  };

  const handleCancelDownload = (key: string) => {
    setDownloads((prev) => prev.filter((task) => task.key !== key));
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Input
          placeholder="Dosya ara"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
        />
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={selectedRowKeys.length === 0}
          >
            İndir
          </Button>
          <Popover
            content={
              <List
                header={<b>İndirme İşlemleri</b>}
                bordered
                dataSource={downloads}
                renderItem={(task) => (
                  <List.Item
                    actions={[
                      <Button icon={<CloseOutlined />} onClick={() => handleCancelDownload(task.key)} danger>İptal</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={task.name}
                      description={<Progress percent={task.progress} />}
                    />
                  </List.Item>
                )}
              />
            }
            title="İndirilenler"
            trigger="click"
            open={isPopoverVisible}
            onOpenChange={setIsPopoverVisible}
          >
            <Badge count={downloads.length}>
              <Button icon={<InboxOutlined />} shape="circle" size="large" />
            </Badge>
          </Popover>
        </Space>
      </Space>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default FileDownload;
