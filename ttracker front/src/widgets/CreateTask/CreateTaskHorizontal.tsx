import EmptyUserIcon from '../../components/EmptyUserIcon/EmptyUserIcon'
import styles from './CreateTaskHorizontal.module.css';
import done from '../../assets/done.svg';
import { useRef, useState } from 'react';
import { useDispatch} from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { createTask } from '../../store/task.slice';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';
import UserIcon from '../../components/UserIcon/UserIcon';
import DatePickerCreateTask from '../../components/Deadline/DatePickerCreateTask';
import UserProjectPickerCrTsk from '../UserProjectPicker/UserProjectPickerCrTsk';
import type { MiniTask } from '../MiniTask/MiniTask';

interface CreateTaskHorizontalProps {
	projectId: number;
	parentTask?: MiniTask;
	statusId: number;
	isSubtask: boolean;
	setIsVisCrTask: (arg: boolean) => void
}

export default function CreateTaskHorizontal({projectId, statusId, isSubtask, setIsVisCrTask, parentTask}: CreateTaskHorizontalProps) {
	const ref = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch<AppDispatch>();

	const [date, setDate] = useState<Date | null>(null);
	const [taskName, setTaskName] = useState<string>('');
	const [executorId, setExecutorId] = useState<number | null>(null)
	const [isUserPickerVisible, setIsUserPickerVisible] = useState<boolean>(false);

	const createTaskHandle = () => {
		if (taskName.trim() !== '') {
			dispatch(createTask({
				taskName,
				projectId,
				statusId,
				deadline: date?.toISOString(),
				executorId: executorId,
				isSubtask: isSubtask,
				parentTaskId: parentTask?.id 
			}));
			setIsVisCrTask(false);
		} else {
			console.log('Введите название');
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && taskName.trim() !== '') {
			createTaskHandle()
			
		}
		if (event.key === 'Escape') {
			setTaskName('');
			setIsVisCrTask(false)
		}
	};

	useClickOutside(ref, () => setIsVisCrTask(false))

	return (
		<div className={!isSubtask ? styles.task : styles.subtask_view} ref={ref}>
			<div className={styles.input_name}>
				<input className={styles.input} 
						type="text" 
						placeholder='Введите название задачи' 
						onChange={(e) => setTaskName(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus 
				/>	
			</div>
			<div className={styles.f_and_e_space}>
				<DatePickerCreateTask date={date} setDate={setDate}/>
				<div className={styles.executor}>
					{executorId ? <UserIcon id={executorId} onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}/> : 
						<EmptyUserIcon elementId='' onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}/>}
					{isUserPickerVisible && <UserProjectPickerCrTsk 
											setIsUserPickerVisible={setIsUserPickerVisible} 
											setExecutorId={setExecutorId}
											executorId={executorId}
									/>
					}
				</div>
				<img className={styles.done}src={done} alt="" onClick={() => createTaskHandle()}/>
			</div>
		</div>
		
	)
}
