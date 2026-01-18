import DatePicker from '../../../components/Deadline/DatePicker';
import EmptyUserIcon from '../../../components/EmptyUserIcon/EmptyUserIcon';
import UserIcon from '../../../components/UserIcon/UserIcon';
import UserProjectPicker from '../../UserProjectPicker/UserProjectPicker';
import styles from './Subtask.module.css';
import dots from '../../../assets/dots.svg';
import done from '../../../assets/done.svg';
import undo from '../../../assets/undo.svg';
import edit from '../../../assets/edit.svg';
import { useEffect, useRef, useState } from 'react';
import type { MiniTask } from '../MiniTask';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { updateTask } from '../../../store/task.slice';
import TaskDropDownMenu from '../TaskDropDownMenu/TaskDropDownMenu';
import { createPortal } from 'react-dom';
import { taskModalActions } from '../../../store/taskModal.slice';

export interface SubTaskProps {
	task: MiniTask;
}

export default function Subtask({ task }: SubTaskProps) {
	const dispatch = useDispatch<AppDispatch>();

	const editTask = useRef<HTMLInputElement>(null)
	
	const [isUserPickerVisible, setIsUserPickerVisible] = useState<boolean>(false);
	const [taskName, setTaskName] = useState<string>(task.taskName);
	const [isTaskEditVisible, setIsTaskEditVisible] = useState<boolean>(false);
	const [isTaskDropDownMenuVis, setIsTaskDropDownMenuVis] = useState<boolean>(false);

	const doneTask = () => {
		if (!task.isDone) {
			dispatch(
				updateTask({id: task.id, isDone: true})
			)
		} else {
			dispatch(
				updateTask({id: task.id, isDone: false})
			)
		}
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (editTask.current && !editTask.current.contains(event.target as Node)) {
				if (taskName.trim() === '' || taskName.trim() === task.taskName) {
					setIsTaskEditVisible(false);
					setTaskName(taskName.trim());
				} else {
					dispatch(updateTask({id: task.id, taskName: taskName}));
					setIsTaskEditVisible(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (taskName.trim() === '' || taskName.trim() === task.taskName) {
					setIsTaskEditVisible(false);
					setTaskName(taskName.trim());
				} else {
					dispatch(updateTask({id: task.id, taskName: taskName}));
					setIsTaskEditVisible(false);
				}
		} else if (event.key === 'Escape') {
			setIsTaskEditVisible(false);
			setTaskName(task.taskName);
		}
	};

	const openTask = () => {
		dispatch(taskModalActions.showModal({taskId: task.id}))
	}

	return (
		<div className={!task.isDone ? styles.task : styles.task_done}>
			<div className={styles.name_space}>
				{!isTaskEditVisible && <div className={styles.menu}>
					<img className={styles.menu_icon} onClick={() => doneTask()} src={!task.isDone ? done : undo} title='Завершить' alt="Завершить" />
					<img className={styles.menu_icon} onClick={() => setIsTaskEditVisible(!isTaskEditVisible)} src={edit} title='Редактировать' alt="Редактировать" />
					<img id={`menu-btn-${task.id}`} className={styles.menu_icon} onClick={() => setIsTaskDropDownMenuVis(true)} src={dots} title='' alt="" />
				</div>}
				{isTaskDropDownMenuVis && 
									createPortal(
										<TaskDropDownMenu 
												task={task} 
												setIsTaskDropDownMenuVis={setIsTaskDropDownMenuVis}
												setIsTaskEditVisible={setIsTaskEditVisible}
												top={10}
												left={10}
										/>,
										document.body
									)
				}
				{!isTaskEditVisible 
					? 
					<div className={!task.isDone ? styles.task_name : styles.task_name_done} 
						onClick={openTask}>
						{task.taskName}
					</div> 
					:
					<input ref={editTask} 
							type="text"
							value={taskName} 
							className={styles.input}  
							onChange={(e) => setTaskName(e.target.value)}
							onKeyDown={handleKeyDown}
							autoFocus
					/>
				}
			</div>
			
			<div className={styles.f_and_e_space} onClick={openTask}>
				<DatePicker date={task.deadline} taskId={task.id}/>
				{/* <div className={styles.features}>
					<div className={styles.property}>Дизайн</div>
					<div className={styles.property}>Сайт</div>
				</div> */}
				<div className={styles.executor} onClick={(e) => e.stopPropagation()}>
					{task.executorId ? <UserIcon 
											elementId={`user-btn-${task.id}`} 
											id={task.executorId} 
											onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}
										/> 
										: 
										<EmptyUserIcon 
											elementId={`user-btn-${task.id}`} 
											onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}
										/>
					}
					{isUserPickerVisible && 
									createPortal(
										<UserProjectPicker 
											setIsUserPickerVisible={setIsUserPickerVisible}
											executorId={task.executorId}
											taskId={task.id}
											elementId={`user-btn-${task.id}`}
									/>,
									document.body)
					}
				</div>
			</div>
		</div>
	)
}
