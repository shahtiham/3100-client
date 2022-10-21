import React, {useState, useContext, useEffect} from "react"
import Axios from 'axios'

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    // commenting out this line to check cors error
    // Axios.defaults.withCredentials = true

    // check login stuff,{user:{"user_id":`${userId}`}}
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVhQGdtYWlsLmNvbSIsImlhdCI6MTY1Njg1NjQ3NCwiZXhwIjoxNjU2OTQyODc0fQ.c3ck7VHtgFVtwHDhPFWb3FluElMuUpobW9Prgz4enco"
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [userName, setUserName] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userEmail, setEmail] = useState(null)

    const [tag, setTag] = useState('all')
    const [prevtag, setPrevtag] = useState(0)

    const [askingT, setAskingT] = useState('')
    const [askingB, setAskingB] = useState('')
    //console.log(userName, askingT)
    const resetAskingB = (val) => {
        setAskingB(val)
    }
    const resetAskingT = (val) => {
        setAskingT(val)
    }
    const resetPrevtag = (val) => {
        setPrevtag(val)
    }
    const resetTag = (val) => {
        setTag(val)
    }

    const ckifloggedin = (v) => {
        Axios.get("https://tiham.herokuapp.com/isloggedin", {headers:{"authorization": `${token}`}})
        .then((res) => {
            console.log(res,userEmail,res.data.email)
            setEmail(res.data.email)
            setUserId(res.data.user_id)
        })
        .catch((err) => {
            console.log(err)
            localStorage.setItem('token', null)
            setToken(null)
            setUserName(null)
            setEmail(null)
        })
    }

    useEffect(() => {
        ckifloggedin(0)
    },[token])

    const resetToken = (tkn) => {
        setToken(tkn)
    }

    const resetUserName = (val) => {
        setUserName(val)
    }

    const resetUserId = (val) => {
        setUserId(val)
    }

    const resetEmail = (val) => {
        setEmail(val)
    }
    
    const logUserIn = () => {
        setIsUserLoggedIn = true
    }

    const logUserOut = () => {
        setIsUserLoggedIn = false
    }
    
    return <AppContext.Provider value={{
        isUserLoggedIn,
        token,
        userName,
        userId,
        userEmail,
        tag,
        prevtag,
        askingT,
        askingB,
        resetAskingB,
        resetAskingT,
        resetTag,
        resetPrevtag,
        resetToken,
        resetUserName,
        resetUserId,
        resetEmail,
        logUserIn,
        logUserOut,
        ckifloggedin,
    }}>
        {children}
    </AppContext.Provider>
}

// CUSTOM HOOK
export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider}