import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Axios from 'axios'

import {useGlobalContext} from './Context'

function Signup() {
    const navigate = useNavigate()/*   */

    const {resetToken, resetUserName, resetEmail, token, resetUserId} = useGlobalContext()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //console.log('Signup rendered',token)

    //Axios.defaults.withCredentials = true

    const handlesubmit = async (e) => {
        e.preventDefault()
        //console.log("e")
        Axios.post("https://tiham.herokuapp.com/register", {
            username: username,
            email: email,
            pass: password,
        }).then((res) => {
            //console.log(res,"THEn")
            if(res.data === "User Already Exist. Please Login"){
                alert("Email Already Exists")
            } else {
                localStorage.setItem("token", res.data.token)
                resetToken(res.data.token)
                resetUserName(res.data.username)
                resetUserId(res.data.insertId)
                resetEmail(res.data.email)
                navigate("/")
            }
        }).catch((err) => {
            //console.log(err)
            localStorage.setItem("token", null)
            alert("Unknown Error Occured")
        })
    }

    return (
        <div className="lspagelogin">
            <div className="lspagelocreate">
                <h2>Signup</h2>
                <form onSubmit={handlesubmit}>
                    <label>username:</label>
                    <input 
                        type="text" 
                        required 
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
 
export default Signup;