import { useEffect, useRef, useState } from 'react';
import styles from './ChangeProject.module.css'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import type { SetState } from '../../helpers/HooksTypes';
import type { Project } from '../../features/leftmenu/project_item/ProjectItem';
import { updateProject } from '../../store/project.slice';

interface ChangeProjectProps {
	setIsVisibleChangeInput: SetState<boolean>;
	project: Project
}

export default function ChangeProject({ project, setIsVisibleChangeInput }: ChangeProjectProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [projectName, setProjectName] = useState(project.name);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (ref.current && !ref.current.contains(event.target as Node)) {
					if (projectName.trim() === '' || projectName.trim() === project.name) {
						setIsVisibleChangeInput(false)
					} else {
						dispatch(updateProject({ id: project.id, name: projectName.trim() }));
						setIsVisibleChangeInput(false)
						setProjectName(projectName)
					}
				}
			};
	
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [projectName]
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (projectName.trim() == '' || projectName.trim() !== projectName || projectName.trim() === project.name) {
				setIsVisibleChangeInput(false)
			} else {
				dispatch(updateProject({ id: project.id, name: projectName.trim() }));
				setIsVisibleChangeInput(false)
				setProjectName(projectName)
			}
		}
		if (event.key === 'Escape') {
			setIsVisibleChangeInput(false);
		}
	};
		
	return (
		<div className={styles.change_project}>
			<input
				name='rename-project'
				value={projectName}
				className={styles.input_change_project}
				onChange={(e) => setProjectName(e.target.value)}
				onKeyDown={handleKeyDown} 
				type='text'
				ref={ref} 
				autoFocus 
			/>
		</div>
	)
}
