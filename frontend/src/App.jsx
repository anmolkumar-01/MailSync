import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage, SigninPage} from './pages'

function App() {

  const { user } = useAppStore();

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/signin' element={!user? <SigninPage/> : <Navigate to='/'/>}></Route>
      </Routes>
    </div>
  )
}

export default App
