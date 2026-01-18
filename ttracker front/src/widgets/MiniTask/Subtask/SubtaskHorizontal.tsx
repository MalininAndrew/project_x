import DatePicker from '../../../components/Deadline/DatePicker';
import EmptyUserIcon from '../../../components/EmptyUserIcon/EmptyUserIcon';
import UserIcon from '../../../components/UserIcon/UserIcon';
import UserProjectPicker from '../../UserProjectPicker/UserProjectPicker';
import dots from '../../../assets/dots.svg';
import done from '../../../assets/done.svg';
import undo from '../../../assets/undo.svg';
import edit from '../../../assets/edit.svg';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { updateTask } from '../../../store/task.slice';
import TaskDropDownMenu from '../TaskDropDownMenu/TaskDropDownMenu';
import { createPortal } from 'react-dom';
import styles from './SubtaskHorizontal.module.css';
import type { SubTaskProps } from './Subtask'
import StatusComponent from '../../../components/Status/Status';
import { taskModalActions } from '../../../store/taskModal.slice';

export default function SubtaskHorizontal({ task }: SubTaskProps) {
	const dispatch = useDispatch<AppDispatch>();

	const editTask = useRef<HTMLInputElement>(null)

	const status = useSelector((s: RootState)  => 
		s.projects.projects.find(p => p.id == task.projectId)?.
					statuses.find(s => s.id == task.statusId)!
	);
	
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
				{isTaskDropDownMenuVis && 
									createPortal(
										<TaskDropDownMenu 
												task={task} 
												setIsTaskDropDownMenuVis={setIsTaskDropDownMenuVis}
												setIsTaskEditVisible={setIsTaskEditVisible}
												top={5}
												left={-100}
										/>,
										document.body
									)
				}
				{!isTaskEditVisible ? <div className={!task.isDone ? styles.task_name : styles.task_name_done}
										onClick={openTask}
										>
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
				{!isTaskEditVisible && <div className={!task.isDone ? styles.menu : styles.menu_done}>
					<img className={styles.menu_icon} onClick={() => doneTask()} src={!task.isDone ? done : undo} title='Завершить' alt="Завершить" />
					<img className={styles.menu_icon} onClick={() => setIsTaskEditVisible(!isTaskEditVisible)} src={edit} title='Редактировать' alt="Редактировать" />
				</div>}
			</div>
			
			<div className={styles.f_and_e_space}>
				<DatePicker date={task.deadline} taskId={task.id}/>
				<StatusComponent status={status} activeStatus={task.statusId}/>
				<div className={styles.executor}>
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
				<img id={`menu-btn-${task.id}`} className={styles.menu_icon} onClick={() => setIsTaskDropDownMenuVis(true)} src={dots} title='' alt="" />
			</div>
		</div>
	)
}
