import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createHashRouter, RouterProvider } from 'react-router'
import Login from './components/login/Login.jsx'
import Cart from './components/cart/Cart.jsx'
import Admin from './components/admin/Admin.jsx'
import Homepage from './components/Home/Homepage.jsx'

const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Homepage
      },
     {
      path: '/cart',
      Component: Cart,
     },
     {
      path: '/login',
      Component: Login,
     },
     {
      path: '/admin',
      Component: Admin,
     }

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
