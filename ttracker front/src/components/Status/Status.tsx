import styles from './Status.module.css';
import type { Status } from '../../features/project_space/desk_space/desk/Desk';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { updateTask } from '../../store/task.slice';

interface StatusProps {
	taskId: number;
	status: Status;
	activeStatus: number;
}

export default function StatusComponent({ status, activeStatus, taskId }: StatusProps) {
	const dispatch = useDispatch<AppDispatch>();

	const changeStatus = () => {
		if(activeStatus === status.id) {
			return
		}
		dispatch(updateTask({id: taskId, statusId: status.id}));
		console.log('Меняем статус задачи');
			
	}

	return (
		<div className={
			status.id !== activeStatus ? 
			styles.status : 
			styles.active_status}
			onClick={() => changeStatus()}
		>
		{status.name}
		</div>
	)
}
