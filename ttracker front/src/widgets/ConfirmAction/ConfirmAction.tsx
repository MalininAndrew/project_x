import { useDispatch, useSelector } from 'react-redux';
import styles from './ConfirmAction.module.css'
import type { AppDispatch, RootState } from '../../store/store';
import { modalActions } from '../../store/modal.slice';
import { DELETE_EMPLOYEE, DELETE_PROJECT, DELETE_TASK } from '../../helpers/modalSlice.constants';
import { deleteProject } from '../../store/project.slice';
import { deleteTask } from '../../store/task.slice';
import { taskModalActions } from '../../store/taskModal.slice';
import { deleteEmployee } from '../../store/company.slice';

export default function ConfirmAction() {
	const dispatch = useDispatch<AppDispatch>();
	const { isOpen, message, actionType, payload } = useSelector((s: RootState)  => s.modal);
	const taskWindowIsOpen = useSelector((s: RootState)  => s.taskModal.isOpen);

	const confirmFunc = () => {
		switch(actionType) {
			case DELETE_PROJECT:
				dispatch(deleteProject({id: payload.id}))
				break;
			case DELETE_TASK:
				dispatch(deleteTask({id: payload.id}))
				if(taskWindowIsOpen) {
					dispatch(taskModalActions.hideModal())
				}
				break;
				//Не удаляются подзадачи родительской задачи из стейта. Hужно будет дописать.
			case DELETE_EMPLOYEE:
				dispatch(deleteEmployee({ userId: payload.id }))
				if(taskWindowIsOpen) {
					dispatch(taskModalActions.hideModal())
				}
				break;
		}
		dispatch(modalActions.hideModal());
	}

	if (!isOpen) return null;

	return (
		<div className={styles.form} onClick={() => dispatch(modalActions.hideModal())}>
			<div className={styles.modal_window} onClick={(e) => e.stopPropagation()}>
				<div className={styles.message}>{message}</div>
				<div className={styles.space_for_btns}>
					<button className={styles.btn} onClick={() => confirmFunc()}>Да</button>
					<button className={styles.btn} onClick={() => dispatch(modalActions.hideModal())}>Отмена</button>
				</div>
			</div>
		</div>
	)
}
