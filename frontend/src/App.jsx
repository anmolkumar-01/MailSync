import {Routes, Route} from 'react-router'

import {HomePage, SigninPage} from './pages'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/signin' element={<SigninPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
