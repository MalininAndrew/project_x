import styles from './topmenu.module.css';
import { NavLink } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useClickOutside } from '../../helpers/hooks/useClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { userActions } from '../../store/user.slice';

export default function Topmenu() {
	const dispatch = useDispatch<AppDispatch>();

	const menu = useRef<HTMLDivElement>(null);
	const [ menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

	const name = useSelector((s: RootState)  => s.user.profile?.name);
	const companyName = useSelector((s: RootState)  => s.company.company?.name);

	const closeMenu = () => {
		setMenuIsVisible(false)
	}

	const logout = () => {
		dispatch(userActions.logOut());
	}

	useClickOutside(menu, closeMenu);

	return (
		<div className={styles.topmenu}>
			<div>{companyName}</div>
			<div>
				<input className={styles.search} type="text" name="" id="" />
			</div>
			<div className={styles.user_settings} onClick={() => setMenuIsVisible(!menuIsVisible)}>
				<div className={styles.user_foto}>{name?.[0] || 'А'}</div>
				{menuIsVisible && 
					<div ref={menu} className={styles.dropdown_menu}>
						<NavLink to={`/user-settings`} className={styles.menu_item}>Настройки</NavLink>
						<div className={styles.menu_item} onClick={logout}>Выйти</div>
					</div>
				}
			</div>
		</div>
	)
}
