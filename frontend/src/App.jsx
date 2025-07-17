import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage} from './pages/HomePage'
import MailSyncSkeleton from './components/skeletons/MailSyncSkeleton';

function App() {

  const { user, isSigningIn } = useAppStore();
  // console.log("here is user" , user);

  return (
    <div className='h-screen lg:overflow-hidden'>
      <Routes>
        <Route path='/' element={isSigningIn? <MailSyncSkeleton /> : <HomePage />}></Route>
      </Routes>
    </div>
  )
}

export default App
