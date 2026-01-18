import { Outlet } from 'react-router-dom'
import ProjectSpace from '../../features/project_space/ProjectSpace'
import styles from './RIghtWorkSpace.module.css'

export default function RightWorkSpace() {
	return (
		<div className={styles.right_work_space}>
			<Outlet />
		</div>
	)
}
