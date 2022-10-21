import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Axios from 'axios'
import {useGlobalContext} from './Context'

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const {token} = useGlobalContext()
    const {resetToken, resetUserName, resetEmail, resetUserId, ckifloggedin} = useGlobalContext()


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //console.log('login rendered', token, navigate)

    function mkReq(){
        return new Promise((resolve, reject) => {
            Axios.get("https://tiham.herokuapp.com/isloggedin", {headers:{"authorization": `${token}`}})
            .then((res) => {
                //console.log(res)
                if(res.data.isloggedin === 'loggedin'){
                    reject()
                } else {
                    resolve()
                }
            })
            .catch((err) => {
                //console.log(err)
                localStorage.setItem('token', null)
                resetToken(null)
                resetUserName(null)
                resetUserId(null)
                resetEmail(null)
                resolve()
            })
        })
    }
    
    const ckL = async (a) => {
        try{
            const ck = await mkReq()
        } catch {
            navigate("/questions")
        }
    }

    useEffect(() => {
        console.log('yee')
        if(token !== null || token !== undefined) ckL('a')
    },[])

    const handlesubmit = async (e) => {
        e.preventDefault()
        //console.log("le")

        // check if already logged in...
        try{
            const ckres = await mkReq()
            
            // this section is exec. when user is NOT logged in...
            // LOG USER IN...
            Axios.post("https://tiham.herokuapp.com/login", {
                email: email,
                pass: password,
            }).then((res) => {
                //console.log(res,"THEn")
                localStorage.setItem("token", res.data[0].token)
                resetToken(res.data[0].token)
                resetUserName(res.data[0].username)
                resetUserId(res.data[0].id)
                resetEmail(res.data[0].email)
                //navigate("/")
                location?.pathname === "/" ? navigate("/questions")
                : navigate(-1);
            }).catch((err) => {
                //console.log(err)
                alert("Invalid Credentials")
                localStorage.setItem("token", null)
            })

        } catch {
            // this section is exec. when user is logged in...
            //console.log("ALREADY LOGGED IN...")
            alert("Already Logged In")
        }
        
    }

    return (
        <div className="lspagelogin">
            <div className="lspagelocreate">
                <h2>Login</h2>
                <form onSubmit={handlesubmit}>
                    <label>email:</label>
                    <input 
                        type="email" 
                        required 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>password:</label>
                    <input
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button>Submit</button>
                </form>
            </div>
        </div>
    );
}
 
export default Login;