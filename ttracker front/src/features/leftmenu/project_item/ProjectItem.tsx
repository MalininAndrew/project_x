import styles from './ProjectItem.module.css';
import dots from '../../../assets/three_dots.svg'
import DropdownMenu from '../dropdown_menu/DropdownMenu';
import { useState } from 'react';
import ChangeProject from '../../../components/ChangeProject/ChangeProject';
import { NavLink } from 'react-router-dom';
import cn from 'classnames'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { getTasksByProjects } from '../../../store/task.slice';
import { getProjectTeam, projectActions } from '../../../store/project.slice';

export interface Project {
  id: number;
  name: string;
}

export interface ProjectItemProps {
  project: Project;
}

export default function ProjectItem({project}: ProjectItemProps) {
	const dispatch = useDispatch<AppDispatch>();

	const [ isVisibleMenu, setIsVisibleMenu ] = useState<boolean>(false);
	const [ isVisibleChangeInput, setIsVisibleChangeInput ] = useState<boolean>(false);

	if (isVisibleChangeInput) {
		return <ChangeProject 
			project={project}  
			setIsVisibleChangeInput={setIsVisibleChangeInput}/>
	}

	const loadProject = async (project: Project) => {
		await dispatch(getProjectTeam({ projectId: project.id}));
		await dispatch(getTasksByProjects({id: project.id}));
		dispatch(projectActions.hideModal());
	}

	return (
		<NavLink to={`/project/${project.id}`} className={({ isActive }) => cn(styles['link'], {[styles.active]: isActive})}>
			<li className={styles.project} 
				key={project.id} 
				onDoubleClick={() => setIsVisibleChangeInput(true)}
				onClick={() => loadProject(project)}
			>
				{project.name} 
				<img className={styles.dots} src={dots} alt="" onClick={() => setIsVisibleMenu(true)} />
				{isVisibleMenu && <DropdownMenu 
										key={project.id} 
										setIsVisibleMenu={setIsVisibleMenu}
										setIsVisibleChangeInput={setIsVisibleChangeInput}
										project={project}
									/>
				}
			</li>
		</NavLink>
		
	)
}
