import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function App() {
  const [count, setCount] = useState(0)

  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        const decodedCredentials = jwtDecode(credentialResponse.credential);
        console.log("token : " ,decodedCredentials);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  )
}

export default App
