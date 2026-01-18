import { useDispatch, useSelector } from 'react-redux';
import styles from './UserProjectPicker.module.css';
import type { AppDispatch, RootState } from '../../store/store';
import UserIcon from '../../components/UserIcon/UserIcon';
import { useRef } from 'react';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';
import { updateTask } from '../../store/task.slice';
import { usePortalPosition } from '../../helpers/hooks/usePortalPosition';


interface UserProjectPicker {
	executorId: number | null;
	taskId: number;
	elementId: string;
	setIsUserPickerVisible: (arg: boolean) => void;
}

export default function UserProjectPicker({ setIsUserPickerVisible, executorId, taskId, elementId }: UserProjectPicker) {
	const dispatch = useDispatch<AppDispatch>();
	const projectTeam = useSelector((s: RootState) => s.projects.currentProjectTeam);
	const ref = useRef<HTMLDivElement>(null)

	useClickOutside(ref, () => setIsUserPickerVisible(false))

	const pickUser = (id: number, executorId: number) => {
		dispatch(
			updateTask({id, executorId})
		)
		setIsUserPickerVisible(false);
	}

	const removeUser = () => {
		dispatch(
			updateTask({id: taskId, executorId: null})
		)
		setIsUserPickerVisible(false);
	}

	const coords = usePortalPosition(elementId, 10, 10)
	
	return (
		<div ref={ref} className={styles.team} style={{ top: coords.top, left: coords.left }}>
			{executorId && 
				<div className={styles.remove_user}>
					<span onClick={() => removeUser()}>Убрать исполнителя</span>
				</div>
			}
			{projectTeam?.map((user) => 
				(<div key={user.id} className={styles.user} onClick={() => pickUser(taskId, user.id)}>
					<UserIcon id={user.id} />
					<span>{user.name}</span>
				</div>)
			)}
			
		</div>
	)
}
