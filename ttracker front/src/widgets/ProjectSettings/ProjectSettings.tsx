import { useEffect, useRef, useState } from 'react';
import styles from './ProjectSettings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import close from '../../assets/close.png';
import edit from '../../assets/edit.svg';
import { projectActions } from '../../store/project.slice';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';
import TeamProjectPicker from '../UserProjectPicker/TeamProjectPicker/TeamProjectPicker';
import { createPortal } from 'react-dom';
import { getCompanyData, getUsersByCompanyId } from '../../store/company.slice';
import EmployeeForPrSet from '../../components/Employee/EmployeeForPrSet';

export default function ProjectSettings() {
	const dispatch = useDispatch<AppDispatch>();
	
	const PrSet = useRef<HTMLDivElement>(null);
	const isOpen = useSelector((s: RootState)  => s.projects.currentProject.settingsIsOpen);
	const projectId = useSelector((s: RootState) => s.projects.currentProject.projectId!);
	const projectTeam = useSelector((s: RootState) => s.projects.currentProjectTeam);
	const project = useSelector((s: RootState) => s.projects.projects.find((p) => p.id === projectId));
	const companyId = useSelector((s: RootState)  => s.user.profile?.companyId!);


	const [addingMode, setAddingMode] = useState<boolean>(false);

	const closePrSettingsWindow = () => {
		dispatch(projectActions.hideModal())
	}

	//useClickOutside(PrSet, closePrSettingsWindow);

	useEffect(() => {
			if (companyId) {
				dispatch(getCompanyData({id: companyId}));
				dispatch(getUsersByCompanyId({id: companyId}))
			}
	}, [dispatch, companyId])

	return (
		<div ref={PrSet} id='prSettingsWindow' className={`${styles.pr_set_window} ${isOpen ? styles.open : ''}`}>
			<div className={styles.name_and_close}>
				<div className={styles.headling}>Настройки проекта</div>
				<img src={close} onClick={closePrSettingsWindow} alt="" />
			</div>
			<div className={styles.name}>
				<div>{project?.name}</div>
				<img src={edit} alt="" />
			</div>
			<div className={styles.team}>
				<h2 className={styles.headling2}>Команда проекта</h2>
				<div className={styles.table}>
					{!projectTeam 
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
							{projectTeam.map((member) => <EmployeeForPrSet 
														key={member.id} 
														user={member}
														projectId={projectId}
														projectOwnerId={project?.ownerId!}
													/>
							)}
						</tbody>
					</table>}
					<button id={'btn_add_user_to_project'} className={styles.add_employee} onClick={() => setAddingMode(true)}>Добавить</button>
					{addingMode 
					&& 
					createPortal(<TeamProjectPicker 
									projectId={projectId}
									elementId='btn_add_user_to_project'
									setIsUserPickerVisible={setAddingMode}
					/>,
					document.body)
					}
				</div>
			</div>
		</div>
	)
}
