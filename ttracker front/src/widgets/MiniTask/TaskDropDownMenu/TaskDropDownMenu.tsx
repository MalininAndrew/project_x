import { useEffect, useRef, useState} from 'react';
import styles from './TaskDropDownMenu.module.css';
import { useClickOutside } from '../../../helpers/hooks/useClickOutside';
import { useDispatch } from 'react-redux';
import { modalActions } from '../../../store/modal.slice';
import { DELETE_TASK } from '../../../helpers/modalSlice.constants';
import type { AppDispatch } from '../../../store/store';
import type { MiniTask } from '../MiniTask';
import { usePortalPosition } from '../../../helpers/hooks/usePortalPosition';

interface TaskDropDownMenuProps {
	setIsTaskDropDownMenuVis: (args: boolean) => void;
	setIsTaskEditVisible: (args: boolean) => void;
	task: MiniTask;
	subtasks?: MiniTask[];
	top: number;
	left: number;
}

export default function TaskDropDownMenu({setIsTaskDropDownMenuVis, setIsTaskEditVisible, task, subtasks, top, left }: TaskDropDownMenuProps) {
	const ref = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch<AppDispatch>();

	useClickOutside(ref, () => setIsTaskDropDownMenuVis(false));

	const rename = () => {
		setIsTaskEditVisible(true);
		setIsTaskDropDownMenuVis(false)
	}

	const coords = usePortalPosition(`menu-btn-${task.id}`, top, left)

	const showModal = () => {
		if (!subtasks?.length) {
			dispatch(
				modalActions.showModal({
					message: `Удалить задачу '${task.taskName}'?`,
					actionType: DELETE_TASK,
					payload: task
				})
			);
		}

		if (subtasks !== undefined && subtasks.length > 0) {
			dispatch(
				modalActions.showModal({
					message: `Удалить задачу '${task.taskName}'? Все подзадачи так же удалятся.`,
					actionType: DELETE_TASK,
					payload: task
				})
			);
		}
		
		setIsTaskDropDownMenuVis(false)
	}

	return (
		<div 
			ref={ref} 
			className={styles.menu} 
			style={{
				top: coords.top,
				left: coords.left,
			}}
		>
			<div className={styles.action} onClick={rename}>Переименовать</div>
			<div className={styles.action} onClick={showModal}>Удалить</div>
		</div>
	)
}