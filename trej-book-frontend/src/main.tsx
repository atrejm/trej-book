import React from 'react'
import ReactDOM from 'react-dom/client'
import { 
  createBrowserRouter,
  RouterProvider 
} from 'react-router-dom'
import App from './App.tsx'
import Login from './routes/login.tsx'
import Homepage from './routes/homepage.tsx'
import Register from './routes/register.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "home",
        element: <Homepage />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />

  </React.StrictMode>,
)
