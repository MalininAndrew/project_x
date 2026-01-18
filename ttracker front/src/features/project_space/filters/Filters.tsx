import { useDispatch } from 'react-redux';
import styles from './Filters.module.css'
import type { AppDispatch } from '../../../store/store';
import { projectActions } from '../../../store/project.slice';
import { useParams } from 'react-router-dom';
import settings from '../../../assets/settings_grey.svg';

export default function Filters() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	const openPrSettings = () => {
		dispatch(projectActions.showModal({projectId: Number(id)}))
	}

	return (
		<div className={styles.filters}>
			<div className={styles.filters_menu}>Filters</div>
			<div className={styles.pr_settings}
				onClick={openPrSettings}
			>
				<img src={settings} alt="" />
			</div>
		</div>
	)
}
