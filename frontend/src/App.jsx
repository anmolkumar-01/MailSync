import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage, UserDashboard, PrivacyPolicy} from './pages'
import { NotificationContainer } from './components';

function App() {

  const { currentUser} = useAppStore();

  // console.log("currentUser : ", currentUser);

  return (
    <div className='h-screen verflow-auto no-scrollbar'>

      <Routes>
        
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/privacy-policy' element={<PrivacyPolicy />}></Route>
        <Route path='*' element={<Navigate to='/' />}/>
        <Route path='/dashboard' element={currentUser? <UserDashboard /> : <Navigate to='/' />}></Route>    

      </Routes>

      {/* ---------- Notifications --------- */}
      <NotificationContainer />
    </div>
  )
}

export default App
