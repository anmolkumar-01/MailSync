import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage, OrgDashboard, UserDashboard, PrivacyPolicy, SendEmailsPage} from './pages'
import {Header} from './components'
import MailSyncSkeleton from './components/skeletons/MailSyncSkeleton';
import { NotificationContainer } from './components';

import ProtectedRoute from './components/custom/ProtectedRoutes';

function App() {

  const { user, isSigningIn, currentOrgMembers} = useAppStore();

  const userRoleInOrg = currentOrgMembers.find(
    m => m.userId.toString() === user._id.toString()
  )?.role;

  // console.log("user : ", user);

  return (
    <div className='h-screen verflow-auto no-scrollbar'>

      <Header />

      <Routes>

        <Route path='/' element={isSigningIn? <MailSyncSkeleton /> : <HomePage />}></Route>
        <Route path='/privacy-policy' element={<PrivacyPolicy />}></Route>
        <Route path='*' element={<Navigate to='/' />}/>

        {/* Protected routes */}
        <Route element = {<ProtectedRoute isAllowed={user}/>}>

          <Route path='/dashboard' element={ <UserDashboard /> }></Route>    
          <Route path='/org-dashboard' element={ <OrgDashboard />}></Route>    
          <Route path='/send' element={userRoleInOrg? <SendEmailsPage /> : <OrgDashboard/>}></Route>
        </Route>

      </Routes>

      {/* ---------- Notifications --------- */}
      <NotificationContainer />
    </div>
  )
}

export default App
