import styles from './Tabs.module.css'
import desk_icon from '../../../assets/desk_icon.png';

export default function Tabs() {
	return (
		<div className={styles.tabs}>
			<div className={styles.tab}>
				<img src={desk_icon} alt="" />
				<span className={styles.name}>Доска</span>
			</div>
		</div>
	)
}
