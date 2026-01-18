import LeftMenu from '../../features/leftmenu/LeftMenu'
import RightWorkSpace from '../right_work_space/RIghtWorkSpace'
import styles from './WorkSpace.module.css'

export default function WorkSpace() {
  return (
	  <div className={styles.work_space}>
      <LeftMenu />
      <RightWorkSpace />
    </div>
  )
}
