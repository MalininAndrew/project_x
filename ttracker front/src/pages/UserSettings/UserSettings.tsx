import { useEffect, useState } from 'react';
import styles from './UserSettings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { getCompanyData, getUsersByCompanyId, updateCompany } from '../../store/company.slice';
import Employee from '../../components/Employee/Employee';
import AddUser from '../../widgets/AddUser/AddUser';
import edit from '../../assets/edit.svg';

export default function UserSettings() {
	const dispatch = useDispatch<AppDispatch>();

	const companyId = useSelector((s: RootState)  => s.user.profile?.companyId!);
	const team = useSelector((s: RootState) => s.company.team);
	const company = useSelector((s: RootState)  => s.company.company);

	const [companyName, setCompanyName] = useState<string>(company?.name!);
	const [addingMode, setAddingMode] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);

	useEffect(() => {
		if (companyId) {
			dispatch(getCompanyData({id: companyId}));
			dispatch(getUsersByCompanyId({id: companyId}))
		}
	}, [dispatch, companyId])

	useEffect(() => {
		if (company?.name) {
			setCompanyName(company?.name!);
		}
		
	}, [company?.name])

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				if (companyName.trim() === '' || companyName.trim() === company?.name) {
						setEditMode(false);
						setCompanyName(companyName.trim());
					} else {
						dispatch(updateCompany({id: companyId, name: companyName.trim()}));
						setEditMode(false);
					}
			} else if (event.key === 'Escape') {
				setEditMode(false);
				setCompanyName(company?.name!);
			}
		};
	
	const onBlurEditCompanyName = () => {
		if (!companyName || !company?.name) {
			setEditMode(false);
			return;
		}

		if (companyName.trim() === '' || companyName.trim() === company?.name) {
			setEditMode(false);
			setCompanyName(companyName.trim());
		} else {
			dispatch(updateCompany({id: companyId, name: companyName.trim()}));
			setEditMode(false);
		}
	}

	return (
		<div className={styles.settings}>
			<div className={styles.company_settings}>
				<h1 className={styles.headling}>Настройки компании</h1>
				<div className={styles.company_info}>
					{!editMode 
					? 
					<div>{company?.name}</div>
					:
					<input 
						type="text"
						value={companyName} 
						className={styles.input}  
						onChange={(e) => {
							setCompanyName(e.target.value)
							console.log(companyName)
						}}
						onKeyDown={handleKeyDown}
						onBlur={() => onBlurEditCompanyName()}
						autoFocus
					/>}
					{!editMode && <img src={edit} alt="" onClick={() => setEditMode(!editMode)}/>}
				</div>
				<div>
					<h2 className={styles.headling2}>Сотрудники компании</h2>
					<div>
						<button className={styles.add_employee} onClick={() => setAddingMode(true)}>Добавить сотрудника</button>
						{addingMode && <AddUser close={setAddingMode}/>}
						<div className={styles.table}>
							{team.length == 0 
							? 
							<div>Вы еще не добавили сотрудников в компанию</div> 
							:
							<table className={styles.users_table}>
								<thead>
									<tr>
										<th>Имя</th>
										<th>Почта</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{team.map((member) => <Employee 
																key={member.id} 
																user={member}
															/>
									)}
								</tbody>
							</table>}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
