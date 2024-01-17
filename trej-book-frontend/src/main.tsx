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
import './styles.css'
import Profile from './routes/profile.tsx'
import NavHeader from './components/navbar.tsx'
import Feed from './routes/feed.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },
  {
    path: "home",
    element: <Homepage />,
    children: [
      {
        path: "",
        element: <Feed />
      },
      {
        path: "feed",
        element: <Feed />
      },
      {
        path: "profile",
        element: <Profile />
      },
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
