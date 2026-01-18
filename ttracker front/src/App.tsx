import { useEffect } from 'react';
import './App.css';
import Topmenu from './features/topmenu/Topmenu';
import WorkSpace from './layouts/main_work_place/WorkSpace';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store';
import { getProfile } from './store/user.slice';
import { getUsersProjects } from './store/project.slice';
import ConfirmAction from './widgets/ConfirmAction/ConfirmAction';


function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      dispatch(getProfile())
      .unwrap()
      .then(() => {
        dispatch(getUsersProjects());
      })
      .catch((err) => console.error(err));
  }, [])

  return (
    <>
      <ConfirmAction />
      <Topmenu />
      <WorkSpace />
    </>
  )
}

export default App
