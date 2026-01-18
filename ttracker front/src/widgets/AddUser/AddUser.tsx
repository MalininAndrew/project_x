import styles from './AddUser.module.css';
import cancel from '../../assets/close.png';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { useState } from 'react';
import { companyActions, createNewEmployee } from '../../store/company.slice';

interface AddUserProps {
	close: (arg: boolean) => void;
}

export default function AddUser({ close }: AddUserProps) {
	const dispatch = useDispatch<AppDispatch>();

	const companyId = useSelector((s: RootState)  => s.user.profile?.companyId!);
	const createError = useSelector((s: RootState)  => s.company.createEmployeeError);

	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const addEmpoyee = async () => {
		if (name.trim() !== '' && name.trim() !== '' && name.trim() !== '') {
			dispatch(companyActions.clearCreateEmployeeError());
			const creatingResult = await dispatch(createNewEmployee({name, email, password, roleId: 2, companyId}));
			
			if (createNewEmployee.fulfilled.match(creatingResult)) {
				close(false);
			}
		}
	}

	return (
		<div className={styles.add_user}>
			<img className={styles.close} onClick={() => close(false)} src={cancel} alt="" />
			{createError && <div className={styles.error_place}>{createError}</div>}
			<div className={styles.inputs}>
				<div className={styles.input_box}>
					<label className={styles.label} htmlFor="name">Имя сотрудника</label>
					<input className={styles.input}
							value={name}
							onChange={(e) => setName(e.target.value)} 
							type="text" 
							id='name' 
							name='name' 
							placeholder="Введите имя" 
					/>
				</div>
				<div className={styles.input_box}>
					<label className={styles.label} htmlFor="email">Почта</label>
					<input className={styles.input}
							value={email}
							onChange={(e) => setEmail(e.target.value)}  
							type="email" 
							id='email' 
							name='email' 
							placeholder="Введите почту"
					/>
				</div>
				<div className={styles.input_box}>
					<label className={styles.label} htmlFor="password">Пароль</label>
					<input className={styles.input}
							value={password}
							onChange={(e) => setPassword(e.target.value)}  
							type="text" 
							id='password' 
							name='password' 
							placeholder="Введите пароль"
					/>
				</div>
			</div>
			<button className={styles.btn} onClick={addEmpoyee}>Добавить</button>
		</div>
	)
}
