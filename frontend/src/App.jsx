import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage} from './pages/HomePage'
import {SendEmailsPage} from './pages/SendEmailsPage'
import MailSyncSkeleton from './components/skeletons/MailSyncSkeleton';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotificationContainer } from './components';

function App() {

  const { user, isSigningIn} = useAppStore();

  // console.log("user : ", user);

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/' element={isSigningIn? <MailSyncSkeleton /> : <HomePage />}></Route>
        <Route path='/privacy-policy' element={<PrivacyPolicy />}></Route>
        <Route path='/send' element={<SendEmailsPage />}></Route>
      </Routes>

      {/* ---------- Notifications --------- */}
      <NotificationContainer />
    </div>
  )
}

export default App
