import { useSelector } from 'react-redux';
import styles from './UserProjectPicker.module.css';
import type { RootState } from '../../store/store';
import UserIcon from '../../components/UserIcon/UserIcon';
import { useRef } from 'react';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';

interface UserProjectPicker {
	executorId: number | null;
	setExecutorId: (arg: number | null) => void
	setIsUserPickerVisible: (arg: boolean) => void;
}

export default function UserProjectPickerCrTsk({ setIsUserPickerVisible, setExecutorId, executorId}: UserProjectPicker) {
	
	const projectTeam = useSelector((s: RootState) => s.projects.currentProjectTeam);
	const ref = useRef<HTMLDivElement>(null)

	useClickOutside(ref, () => setIsUserPickerVisible(false))

	const pickUser = (executorId: number) => {
		setExecutorId(executorId)
		setIsUserPickerVisible(false);
	}

	const removeUser = () => {
		setExecutorId(null)
		setIsUserPickerVisible(false);
	}
	
	return (
		<div ref={ref} className={styles.team}>
			{executorId && 
				<div className={styles.remove_user}>
					<span onClick={() => removeUser()}>Убрать исполнителя</span>
				</div>
			}
			{projectTeam?.map((user) => 
				(<div key={user.id} className={styles.user} onClick={() => pickUser(user.id)}>
					<UserIcon id={user.id} />
					<span>{user.name}</span>
				</div>)
			)}
			
		</div>
	)
}
