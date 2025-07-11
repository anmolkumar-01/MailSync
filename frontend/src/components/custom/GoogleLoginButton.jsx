import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function GoogleLoginButton() {
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

export default GoogleLoginButton