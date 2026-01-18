import { Link, useNavigate } from 'react-router-dom'
import Headling from '../../components/Headling/Headling'
import styles from './Login.module.css'
import { useEffect, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { login, userActions } from '../../store/user.slice'

export type LoginForm = {
    email: {
      value: string;
    },
    password: {
      value: string;
    }
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { jwt, loginErrorMessage } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    if(jwt) {
      navigate('/');
    }
  }, [jwt, navigate]);

  const sendLogin = async (email: string, password: string) => {

    dispatch(login({ email, password }));
    // try {
    //     const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/login`, {
    //       login: email,
    //       password
    //     })
    //     dispatch(userActions.addJwt(data.access_token));
    //     navigate('/')
    // } catch (e) {
    //   if( e instanceof AxiosError) {
    //       console.log(e.response?.data.message);
    //       setError(e.response?.data.message);
    //   }
    // }
  }

  const submit = (e: FormEvent) => {
      e.preventDefault();
      dispatch(userActions.clearLoginError())
      const target = e.target as typeof e.target & LoginForm;
      const { email, password } = target;
      sendLogin(email.value, password.value);
  }

  return (
    <div className={styles['login']}>
        <Headling>Вход</Headling>
        {loginErrorMessage && <div className={styles['error']}>{loginErrorMessage}</div>}
        <form className={styles['form']} onSubmit={submit}>
            <div className={styles['field']}>
                <label htmlFor="email">Ваш email</label>
                <input className={styles['input']} id="email" name='email' placeholder='Email'/>
            </div>
            <div className={styles['field']}>
                <label htmlFor="password">Ваш пароль</label>
                <input className={styles['input']} id="password" name='password' type="password" placeholder='Пароль'/>
            </div>
            <button className={styles['btn']}>ВОЙТИ</button>
        </form>
        <div className={styles['links']}>
          <div>Нет аккаунта?</div>
          <Link to="/auth/register">Зарегистрироваться</Link>
        </div>
    </div>
  )
}
