import {Routes, Route, Navigate} from 'react-router'
import { useAppStore } from './store/useAppStore'

import {HomePage} from './pages/HomePage'

function App() {

  const { user } = useAppStore();
  console.log("here is user" , user);

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
