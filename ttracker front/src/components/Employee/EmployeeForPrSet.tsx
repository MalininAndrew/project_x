import styles from './EmployeeForPrSet.module.css';
import del from '../../assets/delete.png';
import type { Profile } from '../../interfaces/profile.interface';
import { useDispatch } from 'react-redux';
import type { AppDispatch} from '../../store/store';
import { removeUserFromProject } from '../../store/project.slice';

interface EmployeeProps {
	projectOwnerId?: number;
	user: Profile;
	projectId?: number;
}

export default function EmployeeForPrSet({ user, projectId, projectOwnerId }: EmployeeProps) {
	const dispatch = useDispatch<AppDispatch>();

	const showModal = () => {
		if (projectId) {
			dispatch(
				removeUserFromProject({
					projectId,
					userId: user.id
				})
			);
		}
	}

	return (
		<tr>
			<td>{user.name}</td>
			<td>{user.email}</td>
			<td>
				{user.id !== projectOwnerId
				&&
				<img className={styles.delete}
						onClick={showModal} 
						src={del} 
						alt="" 
				/>}
			</td>
		</tr>
	)
}
