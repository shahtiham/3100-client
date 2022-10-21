import './bodySection.css';

import { useState,useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { options } from './Options';
import Select from 'react-select'

import Axios from 'axios'
import {useGlobalContext} from './Context'

import MarkDown from './MarkDown';

function Ask() {
    //Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const {token, ckifloggedin} = useGlobalContext()
    const location = useLocation(); // ** Get data (question object) from singleqs.js to edit // TODO[done]

    const [title, setTitle] = useState((location.state !== null)?(location.state.title):(localStorage.getItem('askingT') === null ||localStorage.getItem('askingT') === undefined)?'':
    localStorage.getItem('askingT'))
    const [body, setBody] = useState((location.state !== null)?(location.state.question):(localStorage.getItem('askingB') === null ||localStorage.getItem('askingB') === undefined)?'':
    localStorage.getItem('askingB'))
    const [tag, setTag] = useState((location.state !== null)?(location.state.tag):'')
    
    //console.log(title, tag, location.state)

    const handleSubmit = () => {
        if(tag === ''){
            alert("Please set tag")
        }
        else if(title === '' || body === ''){
            alert("Please fill-up all the fields")
        } else {
            const tb = title.replaceAll(`"`,`\\"`)
            const nb = body.replaceAll(`"`,`\\"`)
            Axios.post("https://tiham.herokuapp.com/questions", {
                title:tb,
                question:nb,
                tag:tag,
            }, { headers:{"authorization": `${token}`}}).then((res) => {
                console.log(res)
                if(res.data === 'Error communicating with DB server'){
                    alert(res.data)
                } else {
                    localStorage.setItem('askingT','')
                    localStorage.setItem('askingB','')
                    window.scrollTo({top:0,behavior:'smooth'})
                    navigate(`/questions/${res.data.insertId}`)
                }
            }).catch((err) => {
                console.log(err)
                if(err.response.data === 'Invalid Token'){
                    alert('Please login before asking a question')
                    ckifloggedin(0)
                } else {
                    alert('Unknown error occured')
                }
            })
        }
    }

    const handleEdit = () => {
        //console.log('edited')
        const tb = title.replaceAll(`"`,`\\"`)
        const nb = body.replaceAll(`"`,`\\"`)
        Axios.post("https://tiham.herokuapp.com/questions/edit", {
            q_id:location.state.q_id,
            u_id:location.state.u_id,
            title:tb,
            question:nb,
            tag:tag,
        }, { headers:{"authorization": `${token}`}}).then((res) => {
            //console.log(res)
            if(res.data === 'Error communicating with DB server' || res.data === "You can not edit other's question"){
                alert(res.data)
            } else {
                window.scrollTo({top:0,behavior:'smooth'})
                navigate(`/questions/${location.state.q_id}`)
            }
        }).catch((err) => {
            //console.log(err)
            if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                alert('Please login before Editing a question')
                ckifloggedin(0)
            } else {
                alert('Unknown error occured')
            }
        })
    }

    return(
        <div className='sec2q'>
            <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Title</h3>
            <div className='txtcont'>
                <textarea id='mytitle' className="txtarea asktxttitle" required
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                        if(location.state === null)localStorage.setItem('askingT',e.target.value)
                    }}
                />
            </div>

            <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Question</h3>
            <div className='txtcont'>
                <textarea id='mytxt' className="txtarea asktxtbody" required
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value)
                        if(location.state === null)localStorage.setItem('askingB',e.target.value)
                    }}
                />
            </div>
            {/* instruction container.. */}
            <div className="instcont">
                <div className='instcodecont'>
                    ```
                    <code>code</code>
                    ```
                </div>
                <div className='instboldcont instboldcontd1'>**bold**</div>
                <div className='instboldcont instboldcontd2'>*italic*</div>
                <div className='instboldcont instboldcontd2' style={{fontStyle:"normal"}}> {'>'}qoute</div>
                <div className='instboldcont instboldcontd2' style={{fontStyle:"normal"}}> [link](address) </div>
                <a style={{textDecoration:'none',cursor:'pointer'}} href="https://stackoverflow.com/editing-help" target="_blank" rel="noopener noreferrer">More</a>
            </div>
            {/* markdown container.. */}
            <div className="revcont">
                {/* This one WORKS */}
                <MarkDown text={body} />
            </div>
            
            <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Tag</h3>
            
            <div style={{display:"flex",flexDirection:"row",width:'100%',position:"relative",}}>
                <div style={{position:"relative",boxSizing:"border-box",display:"inline-block",width:"300px",marginLeft:"10px",marginBottom:"120px"}}>
                    <Select placeholder={"Tag..."} defaultInputValue={(tag!=='')?tag:'all'} isMulti={false} options={options} onChange={(e)=>{
                        setTag(e.label)
                    }}/>
                </div>
                <div className='askpagesubmitbtncont'>
                    <button onClick={(location.state === null)?handleSubmit:handleEdit}>
                        Submit
                    </button>
                </div>
            </div>
            
            <div className='dummydiv'></div>
            

        </div>
    );
}

export default Ask;