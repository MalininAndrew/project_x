import { useRef} from 'react';
import styles from './DropdownMenu.module.css';
import { useClickOutside } from '../../../helpers/hooks/useClickOutside';
import { useDispatch } from 'react-redux';
import { modalActions } from '../../../store/modal.slice';
import type { Project } from '../project_item/ProjectItem';
import { DELETE_PROJECT } from '../../../helpers/modalSlice.constants';
import type { AppDispatch } from '../../../store/store';

interface DropdownMenuProps {
	setIsVisibleMenu: (args: boolean) => void;
	setIsVisibleChangeInput: (args: boolean) => void;
	project: Project
}

export default function DropdownMenu({setIsVisibleMenu, setIsVisibleChangeInput, project }: DropdownMenuProps) {
	const ref = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch<AppDispatch>();

	useClickOutside(ref, () => setIsVisibleMenu(false));

	const rename = () => {
		setIsVisibleChangeInput(true);
		setIsVisibleMenu(false)
	}

	const showModal = () => {
		dispatch(
			modalActions.showModal({
				message: `Удалить проект '${project.name}'?`,
				actionType: DELETE_PROJECT,
				payload: project
			})
		);
		setIsVisibleMenu(false)
	}

	return (
		<div ref={ref} className={styles.menu}>
			<div className={styles.action} onClick={rename}>Переименовать</div>
			<div className={styles.action} onClick={showModal}>Удалить</div>
		</div>
	)
}
