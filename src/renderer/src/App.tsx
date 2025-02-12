import { Button, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment } from './redux/exampleSlice'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const count = useSelector((state) => state.example.value)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <Card className="p-6 shadow-2xl w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Counter</h1>
        <p className="text-xl mb-4">Count: {count}</p>
        <div className="flex justify-center space-x-4">
          <Button type="primary" onClick={() => dispatch(increment())}>
            Artır
          </Button>
          <Button danger onClick={() => dispatch(decrement())}>
            Azalt
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default App
