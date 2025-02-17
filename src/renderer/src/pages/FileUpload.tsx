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
  List,
  FloatButton,
  Checkbox
} from 'antd'
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClearOutlined
} from '@ant-design/icons'

const { Dragger } = Upload
const { TextArea } = Input
const { Option } = Select

type FileType = UploadFile<any>[]

const FileUpload: React.FC = () => {
  const [users, setUsers] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [fileList, setFileList] = useState<FileType>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isDirectory, setIsDirectory] = useState(false)
  const [isCompressed, setIsCompressed] = useState(false)
  const [shareType, setShareType] = useState<string>('public')

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
    setShowControls(info.fileList.length > 0)
  }

  const handleRemoveFile = (file: UploadFile) => {
    const updatedList = fileList.filter((f) => f.uid !== file.uid)
    setFileList(updatedList)
    setShowControls(updatedList.length > 0)
  }

  const handleClearAllFiles = () => {
    setFileList([])
    setShowControls(false)
  }

  const handleSubmit = () => {
    if (description.length < 10) {
      message.error('Açıklama en az 10 karakter olmalıdır.')
      return
    }
    message.success('Dosya başarıyla yüklendi!')
  }

  const handleScrollToggle = () => {
    window.scrollTo({ top: isAtBottom ? 0 : document.body.scrollHeight, behavior: 'smooth' })
    setIsAtBottom(!isAtBottom)
  }

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Dosya Yükleme</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Paylaşım Tipi">
            <Select value={shareType} onChange={setShareType} style={{ width: '100%' }}>
              <Option value="public">Genel</Option>
              <Option value="private">Özel</Option>
              <Option value="restricted">Kısıtlı</Option>
            </Select>
          </Form.Item>

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

          <Form.Item label="Açıklama">
            <TextArea
              rows={1}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Checkbox checked={isDirectory} onChange={(e) => setIsDirectory(e.target.checked)}>
              Dizin olarak yükle
            </Checkbox>
            <Checkbox checked={isCompressed} onChange={(e) => setIsCompressed(e.target.checked)}>
              Sıkıştır
            </Checkbox>
          </Form.Item>

          <Form.Item label="Dosya Yükleme">
            <Dragger
              multiple
              directory={isDirectory}
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
                  <List.Item.Meta title={file.name} description={<Progress percent={100} />} />
                </List.Item>
              )}
            />
          )}
        </Form>
        {showControls && (
          <div className="w-full flex justify-center gap-4">
            <Button icon={<UploadOutlined />} type="primary" onClick={handleSubmit}>
              Yükle
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={handleClearAllFiles}>
              Tümünü Temizle
            </Button>
          </div>
        )}
      </Card>

      <FloatButton
        icon={isAtBottom ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        type="primary"
        className="fixed bottom-6 right-6"
        onClick={handleScrollToggle}
      />
    </div>
  )
}

export default FileUpload
