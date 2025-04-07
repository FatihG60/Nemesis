import React, { useEffect, useState } from 'react'
import {
  Button,
  Breadcrumb,
  List,
  Typography,
  message,
  Card,
  Checkbox,
  Table,
  Input,
  Popconfirm,
  Select,
  Progress
} from 'antd'
import {
  FolderOpenOutlined,
  FileOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileZipOutlined
} from '@ant-design/icons'

const { ipcRenderer } = window.electron || {}
const { Text } = Typography
const { Search } = Input
const { Option } = Select

interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
}

const FileExplorer: React.FC = () => {
  const [disks, setDisks] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [addedFiles, setAddedFiles] = useState<FileEntry[]>([])
  const [filterText, setFilterText] = useState<string>('')
  const [zipProgress, setZipProgress] = useState<number | null>(null)

  useEffect(() => {
    ipcRenderer
      .invoke('list-root-disks')
      .then((drives: string[]) => {
        setDisks(drives)
      })
      .catch(() => message.error('Diskler alınamadı'))
  }, [])
  useEffect(() => {
    const onProgress = (_event: any, percent: number) => {
      setZipProgress(percent)
    }

    window.electron.ipcRenderer.on('zip-progress', onProgress)

    return () => {
      window.electron.ipcRenderer.removeAllListeners('zip-progress')
    }
  }, [])

  const handleDiskSelect = async (disk: string) => {
    if (disk === 'MTP') {
      try {
        const paths: string[] = await ipcRenderer.invoke('select-mtp-files')
        const mapped: FileEntry[] = await Promise.all(
          paths.map(async (filePath) => {
            const size = await ipcRenderer.invoke('get-file-size', filePath)
            return {
              name: filePath.split(/\\|\//).pop() || 'Dosya',
              path: filePath,
              isDirectory: false,
              size
            }
          })
        )
        setAddedFiles((prev) => [...prev, ...mapped])
      } catch (err) {
        message.error('Dosyalar alınamadı.')
      }
      return
    }

    setCurrentPath(disk)
    loadDirectory(disk)
  }

  const loadDirectory = async (path: string) => {
    try {
      const contents: FileEntry[] = await ipcRenderer.invoke('read-directory', path)
      setEntries(contents)
      setSelectedEntries([])
    } catch (err) {
      message.error('Dizin okunamadı')
    }
  }

  const handleEntryClick = (entry: FileEntry) => {
    if (entry.isDirectory) {
      setCurrentPath(entry.path)
      loadDirectory(entry.path)
    }
  }

  const handleGoUp = () => {
    const parent = currentPath.split(/\\|\//).slice(0, -1).join('/')
    if (parent) {
      setCurrentPath(parent)
      loadDirectory(parent)
    }
  }

  const handleCheck = (path: string, checked: boolean) => {
    setSelectedEntries((prev) => (checked ? [...prev, path] : prev.filter((p) => p !== path)))
  }

  const handleAdd = async () => {
    const selectedFiles = entries.filter((entry) => selectedEntries.includes(entry.path))
    const withSize = await Promise.all(
      selectedFiles.map(async (file) => {
        if (!file.isDirectory) {
          const size = await ipcRenderer.invoke('get-file-size', file.path)
          return { ...file, size }
        }
        return file
      })
    )
    setAddedFiles((prev) => [...prev, ...withSize])
    setSelectedEntries([])
  }

  const handleRemoveFromList = (path: string) => {
    setAddedFiles((prev) => prev.filter((file) => file.path !== path))
  }

  const handleZipFiles = async () => {
    try {
      setZipProgress(0)
      const paths = addedFiles.map((file) => file.path)
      const zipPath = await ipcRenderer.invoke('zip-files', paths)
      setZipProgress(null)
      message.success(`Zip oluşturuldu: ${zipPath}`)
    } catch (err) {
      setZipProgress(null)
      message.error('Zip dosyası oluşturulamadı.')
    }
  }

  const formatFileSize = (size?: number) => {
    if (typeof size !== 'number') return '-'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <Card title="Dosya Gezgini" style={{ maxWidth: 800, margin: '0 auto', marginTop: 32 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Select placeholder="Disk seçin" onChange={handleDiskSelect} style={{ width: 150 }}>
            {disks.map((disk) => (
              <Option key={disk} value={disk}>
                {disk}
              </Option>
            ))}
            <Option key="MTP" value="MTP">
              📱 MTP (Telefon)
            </Option>
          </Select>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Button onClick={handleGoUp} icon={<ArrowUpOutlined />}>
            Yukarı Git
          </Button>
        </Breadcrumb.Item>
        {currentPath && <Breadcrumb.Item>{currentPath}</Breadcrumb.Item>}
      </Breadcrumb>

      <Search
        placeholder="Dosya ara"
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <List
        bordered
        dataSource={filteredEntries}
        renderItem={(entry) => (
          <List.Item
            onClick={() => entry.isDirectory && handleEntryClick(entry)}
            style={{ cursor: entry.isDirectory ? 'pointer' : 'default' }}
            actions={[
              <Checkbox
                checked={selectedEntries.includes(entry.path)}
                onChange={(e) => handleCheck(entry.path, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            ]}
          >
            {entry.isDirectory ? <FolderOpenOutlined /> : <FileOutlined />} &nbsp;
            <Text>{entry.name}</Text>
          </List.Item>
        )}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginTop: 16 }}
        disabled={selectedEntries.length === 0}
      >
        Seçilenleri Ekle
      </Button>

      {addedFiles.length > 0 && (
        <Card title="Eklenen Dosyalar" style={{ marginTop: 24 }}>
          <Table
            dataSource={addedFiles}
            rowKey="path"
            pagination={false}
            columns={[
              {
                title: 'Adı',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: 'Boyut',
                dataIndex: 'size',
                key: 'size',
                render: (size) => formatFileSize(size)
              },
              {
                title: 'İşlem',
                key: 'action',
                render: (_, record) => (
                  <Popconfirm
                    title="Bu dosya kaldırılsın mı?"
                    onConfirm={() => handleRemoveFromList(record.path)}
                    okText="Evet"
                    cancelText="Hayır"
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                )
              }
            ]}
          />

          <Button
            type="dashed"
            icon={<FileZipOutlined />}
            onClick={handleZipFiles}
            style={{ marginTop: 16 }}
          >
            Zip olarak dışa aktar
          </Button>
          {zipProgress !== null && <Progress percent={zipProgress} style={{ marginTop: 12 }} />}
        </Card>
      )}
    </Card>
  )
}

export default FileExplorer
