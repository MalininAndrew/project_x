import { useSelector } from 'react-redux';
import styles from './UserIcon.module.css';
import type { RootState } from '../../store/store';

interface UserIconProps {
	id: number | undefined;
	elementId?: string;
	onClick?: () => void;
}

export default function UserIcon({ id, elementId, onClick }: UserIconProps) {
	const executor = useSelector((s: RootState) => 
		s.projects.currentProjectTeam?.find(user => user.id === id)
	);
	

	if (executor?.img) {
		return (
			<div id={elementId} className={styles.user_icon} onClick={onClick}> 
				<img src={executor.img} alt="" title={executor?.name}/>
			</div>
		)
	}

	return (
		<div id={elementId} className={styles.user_icon} onClick={onClick}>
			<div className={styles.user_name} title={executor?.name}>{executor?.name.charAt(0)}</div>
		</div>
	)
}
