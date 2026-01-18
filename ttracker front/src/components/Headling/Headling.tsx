import type { ReactNode } from 'react'
import styles from './Headling.module.css'

export default function Headling({ children }: { children: ReactNode}) {
  return (
	<h1 className={styles['h1']}>{children}</h1>
  )
}
