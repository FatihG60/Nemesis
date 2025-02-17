import React, { useState, useRef } from 'react'
import {
  Upload,
  Button,
  Input,
  Select,
  Form,
  message,
  Card,
  UploadProps,
  UploadFile,
  Progress,
  Collapse,
  List
} from 'antd'
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'

const { Dragger } = Upload
const { TextArea } = Input
const { Option } = Select
const { Panel } = Collapse

type FileType = UploadFile<any>[]

const FileUpload: React.FC = () => {
  const [users, setUsers] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [fileList, setFileList] = useState<FileType>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isFilesPanelOpen, setIsFilesPanelOpen] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleAddUser = (value: string) => {
    if (value && !users.includes(value)) {
      setUsers([...users, value])
    }
  }

  const handleRemoveUser = (value: string) => {
    setUsers(users.filter((user) => user !== value))
  }

  const handleUpload: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList as FileType)
    const progress = { ...uploadProgress }
    info.fileList.forEach((file) => {
      progress[file.uid] = Math.floor(Math.random() * 50) + 50 // Fake progress simulation
    })
    setUploadProgress(progress)
  }

  const handleRemoveFile = (file: UploadFile) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid))
    const updatedProgress = { ...uploadProgress }
    delete updatedProgress[file.uid]
    setUploadProgress(updatedProgress)
  }

  const handleSubmit = () => {
    if (description.length < 10) {
      message.error('Açıklama en az 10 karakter olmalıdır.')
      return
    }
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      Object.keys(newProgress).forEach((key) => {
        newProgress[key] = 100
      })
      return newProgress
    })
    setIsCollapsed(true)
    setIsFilesPanelOpen(true)
    message.success('Dosya başarıyla yüklendi!')
  }

  return (
    <div className="p-6 min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Dosya Yükleme</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Paylaşılacak Kullanıcılar">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Kullanıcı ekleyin"
              onSelect={handleAddUser}
              onDeselect={handleRemoveUser}
            >
              {users.map((user) => (
                <Option key={user} value={user}>
                  {user}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Açıklama"
            rules={[{ required: true, min: 10, message: 'Açıklama en az 10 karakter olmalıdır.' }]}
          >
            <TextArea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Dosya Yükleme">
            <Dragger
              multiple
              directory
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUpload}
              showUploadList={false}
              onRemove={handleRemoveFile}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Dosyaları sürükleyip bırakın veya tıklayarak seçin</p>
            </Dragger>
          </Form.Item>
          {fileList.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <Button icon={<DeleteOutlined />} onClick={() => handleRemoveFile(file)} danger>
                      Sil
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={file.name}
                    description={uploadProgress[file.uid] && <Progress percent={uploadProgress[file.uid] || 0} />}
                  />
                </List.Item>
              )}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Yükle
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default FileUpload
