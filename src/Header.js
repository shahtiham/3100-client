import { Link, Navigate } from 'react-router-dom';

import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import {useGlobalContext} from './Context'

function Loginbtn({innertxt, route, st}) {
    const navigate = useNavigate()
    return (
        <button className={`slbtn ${st}`} onClick={() => {
            window.scrollTo({top:0,behavior:'smooth'})
            navigate(route)
            //navigate('/questions/1?aid=3')
            //<Navigate to='/login' replace={true}/> // This one doesn't work
        }}>
            {innertxt}
        </button>
    );
}

function Logoutbtn() {
    const {resetToken, resetUserName, resetEmail, resetUserId} = useGlobalContext()
    return (
        <button className='slbtn loginbtn' onClick={() => {
            localStorage.setItem("token", null)
            resetToken(null)
            resetUserName(null)
            resetUserId(null)
            resetEmail(null)
        }}>
            Log out
        </button>
    );
}

function Userbtn() {
    const { userId, userName } = useGlobalContext()
    console.log('user', userId)
    const navigate = useNavigate()
    return (
        <button className='slbtn userbtn' onClick={() => {
            navigate(`/user/${userId}`, {state:{userName:userName}})
        }}>
            Profile
        </button>
    );
}

function Header(props) {
    const [user, setuser] = useState(null)
    const {token} = useGlobalContext()
    //console.log("Header rendered", token)
    return (
        <header className="Appheader">
            {/* Ham Menu */}
            {/* <div className="ham">
                <div className='rec rec1'></div>
                <div className='rec rec2'></div>
                <div className='rec rec3'></div>
            </div> */}

            {/* <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/' className='homelink'>Home</Link> */}
            <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/questions' className='questionlink'>Questions</Link>

            {token?(
                <>
                    <Userbtn />
                    <Logoutbtn />
                </>
                ):(
                    <>
                        <Loginbtn innertxt='Signup' route='/signup' st='signupbtn' />
                        <Loginbtn innertxt='Login' route='/login' st='loginbtn' />
                    </>
                )
            }
        </header>
    );
}

export default Header;