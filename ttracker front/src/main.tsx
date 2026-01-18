import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-day-picker/style.css';
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from './layouts/Auth/AuthLayout.tsx'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import RequireAuth from './helpers/RequireAuth.tsx'
import ProjectSpace from './features/project_space/ProjectSpace.tsx'
import UserSettings from './pages/UserSettings/UserSettings.tsx';

const router = createBrowserRouter([
  {
    path:'/',
    element: <RequireAuth><App /></RequireAuth>,
    children: [
      {
        path: '/project/:id',
        element: <ProjectSpace />
      },
      {
        path: '/user-settings',
        element: <UserSettings />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      }
    ]
  },
  {
    path: '*',
    element: <>Ошибка</>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider> 
  </StrictMode>,
)
