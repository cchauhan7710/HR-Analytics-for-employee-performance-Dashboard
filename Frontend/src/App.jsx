import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './app.route.jsx'
import { AuthProvider } from './Features/Auth/Auth.context.jsx'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
