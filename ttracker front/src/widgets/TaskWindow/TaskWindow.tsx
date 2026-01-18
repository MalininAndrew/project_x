import styles from './TaskWindow.module.css';
import link from '../../assets/link.png';
import done from '../../assets/done.svg';
import undo from '../../assets/undo.svg';
import edit from '../../assets/edit.svg';
import del from '../../assets/delete.png';
import close from '../../assets/close.png';
import plus from '../../assets/plus.png';
import attach from '../../assets/attach.png';
import enter_icon from '../../assets/keyboard_return.png';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../store/store';
import StatusComponent from '../../components/Status/Status';
import { taskModalActions } from '../../store/taskModal.slice';
import DropDownContainer from './DropDownContainer/DropDownContainer';
import { selectSubtasksByParentId } from '../MiniTask/tasks.selectors';
import SubtaskHorizontal from '../MiniTask/Subtask/SubtaskHorizontal';
import { useEffect, useRef, useState } from 'react';
import CreateTaskHorizontal from '../CreateTask/CreateTaskHorizontal';
import TaskProp from '../TaskProp/TaskProp';
import UserChoice from '../UserChoice/UserChoice';
import DatePicker from '../../components/Deadline/DatePicker';
import CommentComponent from '../Comment/Comment';
import { getCommentsByTask, createComment } from '../../store/comments.slice';
import { updateTask } from '../../store/task.slice';
import { modalActions } from '../../store/modal.slice';
import { DELETE_TASK } from '../../helpers/modalSlice.constants';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';


export const selectProjectStatuses = (projectId: number) =>
  createSelector(
    [(state: RootState) => state.projects.projects],
    (projects) => {
      const project = projects.find((p) => p.id === projectId);
      return project?.statuses ? [...project.statuses].sort((a, b) => a.sortIndex - b.sortIndex) : [];
    }
  );

export default function TaskWindow() {
	const dispatch = useDispatch<AppDispatch>();

	const editTask = useRef<HTMLInputElement>(null);
	const taskWindow = useRef<HTMLDivElement>(null);

	const [ isVisCrTask, setIsVisCrTask ] = useState(false);

	const taskId = useSelector((s: RootState)  => s.taskModal.taskId);
	const activeTask = useSelector((s: RootState) => s.tasks.tasks.find(t => t.id === taskId));
	const isOpen = useSelector((s: RootState)  => s.taskModal.isOpen);
	const userId = useSelector((s: RootState)  => s.user.profile?.id);
	const statuses = useSelector(selectProjectStatuses(activeTask?.projectId!));
	const subtasks = useSelector((state: RootState) => selectSubtasksByParentId(state, activeTask?.id!));
	const comments = useSelector((s: RootState)  => s.comments.comments);
	const isLoadingComments = useSelector((s: RootState)  => s.comments.isLoading);

	const [commentInput, setCommentInput] = useState<string>('');
	const [taskName, setTaskName] = useState<string>('');
	const [isTaskEditVisible, setIsTaskEditVisible] = useState<boolean>(false);
	const [taskDesc, setTaskDesc] = useState<string>('');
	const [isDescEditVisible, setIsDescEditVisible] = useState<boolean>(false);

	const countDone = subtasks.filter((t) => t.isDone === true)
	const closeTaskWindow = () => {
		dispatch(taskModalActions.hideModal())
	}

	useClickOutside(taskWindow, closeTaskWindow);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			console.log('Ссылка скопирована');
		} catch (err) {
			console.error('Не удалось скопировать', err);
		}
	};

	useEffect(() => {
		if (taskId) {
			dispatch(getCommentsByTask({id: taskId}))
		}
	}, [taskId])

	useEffect(() => {
		if (activeTask?.taskName) {
			setTaskName(activeTask.taskName);
		}
	}, [activeTask?.taskName]);

	useEffect(() => {
		setTaskDesc(activeTask?.description ?? '');
	}, [taskId]);

	const doneTask = () => {
		if (!activeTask?.isDone) {
			dispatch(
				updateTask({id: activeTask?.id!, isDone: true})
			)
		} else {
			dispatch(
				updateTask({id: activeTask?.id!, isDone: false})
			)
		}
	}

	const createCommentHandle = () => {
		if (userId && taskId && commentInput.trim() !== '') {
			dispatch(createComment({
				description: commentInput,
				userId,
				taskId
			}));
			setCommentInput('')
		} else {
			console.log('Введите текст комментария');
		}
	}

	const createCommentKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && commentInput.trim() !== '') {
			createCommentHandle()
			setCommentInput('');
		}
	};

	const onBlurEditTaskName = () => {
		if (!taskName || !activeTask?.taskName) {
			setIsTaskEditVisible(false);
			return;
		}

		if (taskName.trim() === '' || taskName.trim() === activeTask?.taskName) {
			setIsTaskEditVisible(false);
			setTaskName(activeTask?.taskName!);
		} else {
			dispatch(updateTask({id: activeTask?.id!, taskName: taskName}));
			setIsTaskEditVisible(false);
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (taskName.trim() === '' || taskName.trim() === activeTask?.taskName) {
					setIsTaskEditVisible(false);
					setTaskName(taskName.trim());
				} else {
					dispatch(updateTask({id: activeTask?.id!, taskName: taskName}));
					setIsTaskEditVisible(false);
				}
		} else if (event.key === 'Escape') {
			setIsTaskEditVisible(false);
			setTaskName(activeTask?.taskName!);
		}
	};

	const deleteTaskHandle = () => {
		if (!subtasks?.length) {
				dispatch(
					modalActions.showModal({
						message: `Удалить задачу '${activeTask?.taskName}'?`,
						actionType: DELETE_TASK,
						payload: activeTask
					})
				);
			}
	
			if (subtasks !== undefined && subtasks.length > 0) {
				dispatch(
					modalActions.showModal({
						message: `Удалить задачу '${activeTask?.taskName}'? Все подзадачи так же удалятся.`,
						actionType: DELETE_TASK,
						payload: activeTask
					})
				);
			}
			
			dispatch(taskModalActions.hideModal())
	}

	const saveDescription = () => {
		if (taskDesc.trim() === activeTask?.description) {
			setIsDescEditVisible(false);
			setTaskDesc(activeTask?.description!);
		} else {
			dispatch(updateTask({id: taskId!, description: taskDesc}));
			setIsDescEditVisible(false);
		}
	}

	const saveDescriptionKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && event.ctrlKey || event.key === 'Enter' && event.metaKey) {
				event.preventDefault();
				saveDescription();
			} else if (event.key === 'Escape') {
				setIsDescEditVisible(false);
				setTaskDesc(activeTask?.description!);
			}
		};
	
	return (
		<div ref={taskWindow} id='taskwindow' className={`${styles.task_window} ${isOpen ? styles.open : ''}`}>
			<div className={styles.name_and_btns}>
				{!isTaskEditVisible ? <div 
										className={!activeTask?.isDone ? 
											styles.task_name : 
											styles.task_name_done
										}
										onClick={() => setIsTaskEditVisible(true)}
										>
											{activeTask?.taskName}
										</div> 
										: 
										<input ref={editTask} 
												type="text"
												value={taskName} 
												className={styles.input}  
												onChange={(e) => setTaskName(e.target.value)}
												onKeyDown={handleKeyDown}
												onBlur={() => onBlurEditTaskName()}
												autoFocus
										/>
				}
				<div className={styles.btns}>
					<img className={styles.menu_icon} onClick={() => doneTask()} src={!activeTask?.isDone ? done : undo} title='Завершить' alt="Завершить" />
					<img className={styles.menu_icon} onClick={() => copyToClipboard(`${window.location.origin}/task/${taskId}`)} src={link} title='Ссылка' alt="Ссылка" />
					<img className={styles.menu_icon} onClick={() => setIsTaskEditVisible(!isTaskEditVisible)} src={edit} title='Редактировать название' alt="Редактировать" />
					<img className={styles.menu_icon} onClick={() => deleteTaskHandle()} src={del} title='Удалить' alt="Удалить" />
					<img className={styles.menu_icon} onClick={closeTaskWindow}  src={close} title='Закрыть' alt="Закрыть" />
				</div>
			</div>
			<div className={styles.statuses}>
				{statuses.map((s) => <StatusComponent taskId={taskId!} status={s} activeStatus={activeTask?.statusId!} />)}
			</div>
			<DropDownContainer name={'Описание задачи'}>
				<div className={styles.task_description_container}>
					<div className={styles.task_description}>
						{!isDescEditVisible
							?
							<div className={styles.ready_desc} onClick={() => setIsDescEditVisible(true)}>
								{activeTask?.description}
							</div>
							:
							<div className={styles.text_area_cont}>
								<textarea className={styles.text_area}
											value={taskDesc} 
											name="" 
											id=""
											onChange={(e) => setTaskDesc(e.target.value)}
											onKeyDown={saveDescriptionKeyDown}
											autoFocus
								>
								</textarea>
								<button className={styles.save_btn} onClick={saveDescription}>Сохранить</button>
							</div>
						}
					</div>
					<div className={styles.subtasks_space}>
						<div className={styles.add_and_progress}>
							<div className={styles.add_subtask} onClick={() => setIsVisCrTask(!isVisCrTask)}>
								<img src={plus} alt="" />
								<span className={styles.text}>Добавить подзадачу</span>
							</div>
							{subtasks.length !== 0 && <div className={styles.progress}>
								<progress className={styles.progress_bar} id='subtasks' max={subtasks.length} value={countDone.length}></progress>
								<div> {countDone.length}/{subtasks.length} </div>
							</div>}
						</div>
						{isVisCrTask && <CreateTaskHorizontal 
													projectId={activeTask?.projectId!}
													parentTask={activeTask!}
													statusId={statuses[0].id}
													isSubtask={true}
													setIsVisCrTask={setIsVisCrTask}
						/>}
						<div className={styles.subtasks}>
							{subtasks.map(task => <SubtaskHorizontal task={task}/>)}
						</div>
					</div>
				</div>
				
			</DropDownContainer>
			<DropDownContainer name={'Параметры задачи'}>
				<div className={styles.tasks_param}>
					<TaskProp  title={'Исполнитель'}>
						<UserChoice task={activeTask!} showName={true}/>
					</TaskProp>
					<TaskProp  title={'Дедлайн'}>
						<DatePicker date={activeTask?.deadline!} taskId={activeTask?.id!}/>
					</TaskProp>
				</div>
			</DropDownContainer>
			<DropDownContainer name={'Комментарии'}>
				<div className={styles.comments}>
					{isLoadingComments && 'Загрузка...'}
					{comments.map(c => (<CommentComponent comment={c}/>))}
					{comments.length == 0 && <div className={styles.no_comments}>Комментарие пока нет</div>}
					 <div className={styles.input_comments}>
						<input value={commentInput} onChange={(e) => setCommentInput(e.target.value)} onKeyDown={createCommentKeyDown} type="text" />
						<div className={styles.input_actions}>
							<img src={attach} alt="attach" />
							<img onClick={() => createCommentHandle()} src={enter_icon} alt="enter" />
						</div>
					 </div>
				</div>
			</DropDownContainer>
			
		</div>
	)
}