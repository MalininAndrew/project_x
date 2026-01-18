import styles from './AuthLayout.module.css'
import rasp from '../../assets/raspberry4.png'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className={styles.layout}>
        <div className={styles.logo}>
          <img src={rasp} alt="Логотип компании" />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
    </div>
  )
}
