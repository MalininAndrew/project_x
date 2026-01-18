import { useDispatch, useSelector } from 'react-redux';
import styles from './TeamProjectPicker.module.css';
import type { AppDispatch, RootState } from '../../../store/store';
import UserIcon from '../../../components/UserIcon/UserIcon';
import { useRef } from 'react';
import { useClickOutside } from '../../../helpers/hooks/useClickOutside';
import { usePortalPosition } from '../../../helpers/hooks/usePortalPosition';
import { addMemeberToProject } from '../../../store/project.slice';


interface TeamProjectPickerProps {
	projectId: number;
	elementId: string;
	setIsUserPickerVisible: (arg: boolean) => void;
}

export default function TeamProjectPicker({ setIsUserPickerVisible, elementId, projectId }: TeamProjectPickerProps) {
	const dispatch = useDispatch<AppDispatch>();
	const companyTeam = useSelector((s: RootState) => s.company.team);
	const ref = useRef<HTMLDivElement>(null)

	useClickOutside(ref, () => setIsUserPickerVisible(false));

	const pickUser = (userId: number) => {
		dispatch(
			addMemeberToProject({ userId, projectId })
		)
		setIsUserPickerVisible(false);
	}

	const coords = usePortalPosition(elementId, 0, -110)
	
	return (
		<div ref={ref} className={styles.team} style={{ top: coords.top, left: coords.left }}>
			{companyTeam?.map((user) => 
				(<div key={user.id} className={styles.user} onClick={() => pickUser(user.id)}>
					<UserIcon id={user.id} />
					<span>{user.name}</span>
				</div>)
			)}
		</div>
	)
}
