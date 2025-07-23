import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage} from './pages/HomePage'
import MailSyncSkeleton from './components/skeletons/MailSyncSkeleton';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {

  const { user, isSigningIn} = useAppStore();

  // console.log("user : ", user);

  return (
    <div className='h-screen lg:overflow-hidden'>
      <Routes>
        <Route path='/' element={isSigningIn? <MailSyncSkeleton /> : <HomePage />}></Route>
        <Route path='/privacy-policy' element={<PrivacyPolicy />}></Route>
      </Routes>
    </div>
  )
}

export default App
