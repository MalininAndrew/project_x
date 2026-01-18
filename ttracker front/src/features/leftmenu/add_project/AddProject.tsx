import { useEffect, useRef, useState } from 'react';
import styles from './AddProject.module.css';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { createProject } from '../../../store/project.slice';
import type { SetState } from '../../../helpers/HooksTypes';

interface AddProjectProps {
  setIsCreateProjectShown: SetState<boolean>;
}

export default function AddProject({setIsCreateProjectShown}: AddProjectProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [projectName, setProjectName] = useState('');
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				if (projectName.trim() === '') {
					setIsCreateProjectShown(false); // скрываем если пусто
				} else {
					dispatch(createProject({name: projectName.trim()}));
					setIsCreateProjectShown(false);
					setProjectName('')
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		document.removeEventListener('mousedown', handleClickOutside);
		};
  	}, [projectName]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && projectName.trim() !== '') {
			dispatch(createProject({ name: projectName.trim() }));
			setIsCreateProjectShown(false);
			setProjectName('');
			console.log(projectName);
		} else if (event.key === 'Escape') {
			setIsCreateProjectShown(false);
			setProjectName('');
		}
	};


	return (
		<div className={styles.add_project}>
			<input 
				className={styles.input_add_project}
				onChange={(e) => setProjectName(e.target.value)}
				onKeyDown={handleKeyDown} 
				type='text'
				ref={ref} 
				autoFocus 
			/>
		</div>
	)
}
