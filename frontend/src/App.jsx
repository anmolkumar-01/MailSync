import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage, UserDashboard, PrivacyPolicy} from './pages'
import MailSyncSkeleton from './components/skeletons/MailSyncSkeleton';
import { NotificationContainer } from './components';

import ProtectedRoute from './components/custom/ProtectedRoutes';

function App() {

  const { currentUser, isSigningIn, currentOrgMembers} = useAppStore();

  const userRoleInOrg = currentOrgMembers.find(
    m => m.userId.toString() === currentUser._id.toString()
  )?.role;

  // console.log("currentUser : ", currentUser);

  return (
    <div className='h-screen verflow-auto no-scrollbar'>

      <Routes>

        <Route path='/' element={isSigningIn? <MailSyncSkeleton /> : <HomePage />}></Route>
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
