import styles from './Employee.module.css';
import del from '../../assets/delete.png';
import type { Profile } from '../../interfaces/profile.interface';
import { modalActions } from '../../store/modal.slice';
import { DELETE_EMPLOYEE } from '../../helpers/modalSlice.constants';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';

interface EmployeeProps {
	user: Profile;
}

export default function Employee({ user }: EmployeeProps) {
	const dispatch = useDispatch<AppDispatch>();

	const companyOwnerId = useSelector((s: RootState)  => s.company.company?.ownerId);

	const showModal = () => {
		dispatch(
			modalActions.showModal({
				message: `Удалить сотрудника '${user.name}' из компании?`,
				actionType: DELETE_EMPLOYEE,
				payload: user
			})
		);
	}

	return (
		<tr>
			<td>{user.name}</td>
			<td>{user.email}</td>
			<td>
				{user.id !== companyOwnerId
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
