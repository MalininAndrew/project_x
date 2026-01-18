import { Link, useNavigate } from 'react-router-dom'
import Headling from '../../components/Headling/Headling'
import styles from './Register.module.css'
import { useEffect, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { register, userActions } from '../../store/user.slice'

export type RegisterForm = {
    email: {
      value: string;
    },
    password: {
      value: string;
    },
    name: {
      value: string;
    }
}

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { jwt, registerErrorMessage } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    if(jwt) {
      navigate('/');
    }
  }, [jwt, navigate]);

  const submit = (e: FormEvent) => {
      e.preventDefault();
      dispatch(userActions.clearRegisterError())
      const target = e.target as typeof e.target & RegisterForm;
      const { email, password, name } = target;
      console.log({ email: email.value, password: password.value, name: name.value })
      dispatch(register({ email: email.value, password: password.value, name: name.value }));
  }

  return (
    <div className={styles['login']}>
        <Headling>Регистрация</Headling>
        {registerErrorMessage && <div className={styles['error']}>{registerErrorMessage}</div>}
        <form className={styles['form']} onSubmit={submit}>
          <div className={styles['field']}>
                <label htmlFor="name">Ваше имя</label>
                <input className={styles['input']} id="name" name='name' placeholder='Ваше имя'/>
            </div>
            <div className={styles['field']}>
                <label htmlFor="email">Ваш email</label>
                <input className={styles['input']} id="email" name='email' placeholder='Email'/>
            </div>
            <div className={styles['field']}>
                <label htmlFor="password">Ваш пароль</label>
                <input className={styles['input']} id="password" name='password' type="password" placeholder='Пароль'/>
            </div>
            <button className={styles['btn']}>Зарегистрироваться</button>
        </form>
        <div className={styles['links']}>
          <div>Есть аккаунт?</div>
          <Link to="/auth/login">Войти</Link>
        </div>
    </div>
  )
}

