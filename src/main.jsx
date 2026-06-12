import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  useEffect(() => {
    alert('Hello World')
  }, [])

  return <div id="translator-app">Loading...</div>
}

createRoot(document.getElementById('root')).render(<App />)
