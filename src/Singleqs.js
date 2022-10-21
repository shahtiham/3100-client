import './bodySection.css';
import voteup from './voteup.png'
import votedown from './votedown.png'
import edit from './edit.png'
import copy from './copy.png'

import questions from './qdata';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import React, { useEffect, useState, useRef, useContext } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';
import {useGlobalContext} from './Context'

import MarkDown from './MarkDown';

const QpgContext = React.createContext()

function Singleqs() {
    //Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const location = useLocation();

    let [searchParams, setSearchParams] = useSearchParams(); // * 'http://localhost:3000/questions/1?aid=2' - the aid and so on
    const [tq, setTq] = useState({})
    // Post answer
    const [body, setBody] = useState('')
    const [isediting, setIsediting] = useState(false)
    const [edA, resetEdA] = useState({})
    const [loadAns, resetLoadAns] = useState(false)
    const [aid, setAid] = useState(searchParams.get('aid'))
    const resetAid = (val) => {
        setAid(val)
    }
    const resetIsediting = (val) => {
        setIsediting(val)
    }
    const resetBody = (val) => {
        setBody(val)
    }

    const {token,ckifloggedin} = useGlobalContext()
    const { questionId } = useParams() // * question id from url parameter
    
    const data = location.state?.qs; // * state passed on Link / navigate()

    // get the specific question from db
    //console.log(data, searchParams.get('aid')) // * data from state and 'aid' from url
    console.log('ge ', questionId)

    useEffect(() => {
        Axios.get(`https://tiham.herokuapp.com/questions/tagged/all/${questionId}/date`).then((res) => {
            setTq(res.data[0])
            //console.log(res.data[0]) // * getting specific question
        })
    },[])

    const handlevote = async (e) => {
        //console.log(e) // * Voting on the specific question
        let isU = (e.target.id === 'qbp')?'u':'d'
        Axios.get('https://tiham.herokuapp.com/vote/'+isU.toString()+'/q/'+questionId.toString(), {headers:{"authorization": `${token}`}}).then((res) => {
            //console.log(res)
            let vot = (tq.votes === null)? 0: tq.votes
            if(res.data === 'Error communicating with DB server' || res.data === "not allowed to vote on you'r questions" || res.data === 'Already Voted'){
                alert(res.data)
            } else {
                if(e.target.id === 'qbp'){
                    setTq({...tq, votes: vot + 1})
                } else {
                    setTq({...tq, votes: vot - 1})
                }
            }
        }).catch((err) => {
            if(err.response.data === "A token is required for authentication" || err.response.data === "Invalid Token"){
                alert('Please login before you vote')
                ckifloggedin(0)
            } else {
                alert('Unknown error occured')
            }
        })
      
    }

    const hndlcpy = (lnk) => {
        //console.log(key,document.getElementById('linkNotify').classList)
        navigator.clipboard.writeText(lnk).then(()=>{
            if(!document.getElementById('linkNotify').classList.contains('show')){
                document.getElementById('linkNotify').classList.add('show')
                  setTimeout(() => {
                      document.getElementById('linkNotify').classList.remove('show')
                }, 2000);
            }
        })
    }

    return(
        <div className='sec2q'>
          {/* QUESTION PART BEGIN */}
            <div className='qlist'>
                <div className='ansidcont'>
                    {/* TODO[done] */}
                    <img onClick={(e)=>hndlcpy(`https://coding-queries.netlify.app/questions/${questionId}`)} 
                    src={copy} title='Copy link'/>
                </div>

                <div className='qitem'>
                    {/* The question */}
                    <h2 className='singleqshead'>{tq.title}</h2>
                </div>
            </div>
            {/* here should be question description : begin*/}
            
            <div style={{position:'relative'}} className="revcont">
                {/* This one WORKS */}
                {/* *** MAKE THIS SEPARATE COMPONENT and use here, answer list, post answer and in Ask page */}
                <MarkDown text={tq.question} />

                {/* Edit question... */}
                <img className='editic' onClick={(e)=>{
                    window.scrollTo({top:0,behavior:'smooth'})
                    navigate('/ask', {state:tq})
                }} 
                src={edit} title='Edit'/>
            </div>
            {/* here should be question description : end*/}

            {/* Vote count and info.. begin */}
            <div className='sqdvcont'>
                <button className='sqbp sqbstyle'>
                    <img id='qbp' onClick={(e)=>handlevote(e)}
                    style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                    src={voteup} />
                </button>
              
                <div className='sqvcc'>{(tq.votes === null)? `0 Votes`:`${tq.votes} Votes` }</div>

                <button className='sqbm sqbstyle'>
                    <img id='qbm'  onClick={(e)=>handlevote(e)}
                    style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                    src={votedown} />
                </button>

                <div className='sqab'>
                    <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${tq.u_id}`}>
                        {tq.username}
                    </Link>
                    &nbsp;asked on {Date(tq.date).split('GMT')[0]}
                </div>
            </div>
            <div className='sqdvcont'>
                <div className='sqtc'>Tag : {tq.tag}</div>
            </div>

          {/* QUESTION PART END */}

          {/* ANSWER LIST PART BEGIN */}
            <h1 style={{position:'relative',marginLeft:'10px'}}>Answers</h1>
            {/* Send question id and (aid = a answer id : may not exist, if exists -> show the answer page where this answer lies) */}
            
            <QpgContext.Provider value={{body, resetBody, isediting, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, aid, resetAid}}>
                <PagAsList qid={questionId} />
                <Editor />
            </QpgContext.Provider>

        </div>
    );
}

function  Editor(){
    //Axios.defaults.withCredentials = true
    const {body, resetBody, isediting, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, resetAid} = useContext(QpgContext)
    const [ab, setAb] = useState(body)
    let rf = useRef(null)

    const {token, ckifloggedin} = useGlobalContext()

    //console.log("E ", 'edA', edA, body, isediting, rf)
    useEffect(() => {
        //console.log('rf ', rf)
        if(rf.current !== null && isediting === true) {
            rf.current.scrollIntoView({behavior:'smooth'});
            // resetIsediting(false)
        }
    },[body, isediting])
    useEffect(() => {
        setAb(body)
    },[body])

    const handleSubmit = () => {
        //console.log('s ', ab)
        if(ab === ''){
            alert('Please fill up the answer field')
        } else {
            const nb = ab.replaceAll(`"`,`\\"`)
            Axios.post("https://tiham.herokuapp.com/answers", {
                answer:nb,
                q_id:questionId,
            }, { headers:{"authorization": `${token}`}
            }).then((res) => {
                console.log(res)
                resetLoadAns((loadAns === true)?false:true)
                resetAid(res.data.insertId)
                resetBody('')
                resetEdA({})
                setAb('')
            }).catch((err) => {
                console.log(err)
                if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                    alert('Please login before posting an answer')
                    ckifloggedin(0)
                } else {
                    alert('Unknown error occured')
                }
            })
        }
    }

    // EDIT ANSWER
    const handleEdit = () => {
        //console.log('editing')
        if(ab === ''){
            alert('Please fill up the answer field')
        } else {
            const nb = ab.replaceAll(`"`,`\\"`)
            Axios.post("https://tiham.herokuapp.com/answers/edit", {
                a_id:edA.a_id,
                u_id:edA.u_id,
                answer:nb,
            }, { headers:{"authorization": `${token}`}}).then((res) => {
                //console.log(res)
                if(res.data === 'Error communicating with DB server' || res.data === "You can not edit other's answer"){
                    alert(res.data)
                } else {
                    //console.log('updated')
                    resetAid(edA.a_id)
                    resetLoadAns((loadAns === true)?false:true)
                    resetBody('')
                    resetEdA({})
                    setAb('')
                    resetIsediting(false)
                }
            }).catch((err) => {
                //console.log(err)
                if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                    alert('Please login before Editing')
                    ckifloggedin(0)
                } else {
                    alert('Unknown error occured')
                }
            })
        }
    }
    return(
        <>
            <h3 style={{marginLeft:'15px',marginTop:'35px',marginBottom:'10px',display:'flex'}} ref={rf}>
                {(isediting === true)?<>Post Edited Answer</>:<>Post Answer</>}
                {
                    (isediting)?(<>
                        <div className='canCleEdt' onClick={(e) => {
                            resetBody('')
                            resetEdA({})
                            setAb('')
                            resetIsediting(false)
                        }}>
                            cancel edit
                        </div>
                    </>
                    ):(<></>)
                }
            </h3>
            <div style={{marginTop:'15px', paddingTop:'30px'}} className='txtcont'>
                <textarea style={(isediting)?{borderColor:'red',boxShadow:'0 0 10px #f77070'}:{}} id='myanstxt' className="txtarea asktxtbody" required
                    value={ab}
                    onChange={(e) => {
                        setAb(e.target.value)
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
            </div>
            {/* markdown container.. */}
            <div className="revcont">
                {/* This one WORKS */}
                <MarkDown text={ab} />
            </div>

            <div style={{display:"flex",flexDirection:"row",width:'100%',position:"relative", marginTop:"60px", marginBottom:"30px"}}>
                <div className='askpagesubmitbtncont'>
                    <button onClick={(isediting === false)?handleSubmit:handleEdit}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}

function PagAsList({qid}) {
    const {body, resetBody, isediting, resetIsediting, resetEdA, loadAns, aid, resetAid} = useContext(QpgContext)

    //Axios.defaults.withCredentials = true
    const {token,ckifloggedin} = useGlobalContext()
    let inputElement = useRef(null);
    let ival = 0
    const itemsPerPage = 10
    const [items, setItems] = useState([])
    const [prevtag, setPrevtag] = useState(0)

    // Getting answers for given qid on first PagAsList component render
    useEffect(()=>{
        Axios.get(`https://tiham.herokuapp.com/answers/${qid}`).then((resAns) => {
            //console.log(resAns)
            setItems(resAns.data)
        })
    },[loadAns])
    console.log(items)
    useEffect(()=>{
        if(aid === null || aid === undefined || items.length === 0) ival = 0
        else {
            // *** setting the page (prevtag, default:0) according to 'aid'
            let n = parseInt(aid)
            const cival = items.find((it, index) => {
                if(it.a_id === n) {
                    setPrevtag(Math.floor(index / itemsPerPage))
                    return true
                } 
            })
        }
    },[aid,items])
    
    
    //console.log('it ', items,'ai ', aid,ival,prevtag, inputElement)
    //console.log(inputElement.current,inputElement)
    useEffect(()=>{
        if(inputElement.current !== null) {
            inputElement.current.scrollIntoView({
                behavior: "smooth",
            });

            // This part resets aid and current to null so that only once scroll happens...
            inputElement.current = null
            resetAid(null)
        } else if(inputElement.current === null){
            /* window.scrollTo({
                top:0,
                behavior:"smooth",
            }) */
        }
    },[inputElement.current, aid])
    

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    

    //console.log("pag rend", pageCount, itemOffset, "initpage: ", initialpage, items, currentItems)

    useEffect(() => {
        const pc =(items === undefined || items === null || items.length === 0)? 0 : Math.ceil(items.length / itemsPerPage)
        if(prevtag >= pc){
            const nwofst = 0
            const initpg = 0
            setPageCount(pc)
            setInitialpage(initpg)
            setCurrentItems(items.slice(nwofst, nwofst + itemsPerPage))
        } else {
            const nwofst = (items === undefined || items === null || items.length === 0)? 0 : (prevtag * itemsPerPage) % items.length
            setPageCount(pc)
            setInitialpage(prevtag)
            setCurrentItems(items.slice(nwofst, nwofst + itemsPerPage))
        }
    }, [itemOffset, itemsPerPage, items, initialpage, prevtag]);

    function updp(event){
        return new Promise(async (resolve, reject) => {
            inputElement.current = null
            setPrevtag(event.selected)
            resolve()
        })
    }
    const handlePageClick = async (event) => {
        // do this inst.
        try{
            const wait = await updp(event)
        }catch{
            //console.log('reject')
        }
    };

    const hndlcpy = (lnk) => {
        //console.log(key,document.getElementById('linkNotify').classList)
        navigator.clipboard.writeText(lnk).then(()=>{
            if(!document.getElementById('linkNotify').classList.contains('show')){
                document.getElementById('linkNotify').classList.add('show')
                  setTimeout(() => {
                      document.getElementById('linkNotify').classList.remove('show')
                }, 2000);
            }
        })
    }

    const handlevote = (e, key) => {
        let isU = (e.target.id === 'abp')?'u':'d'
        //console.log(isU)
        Axios.get('https://tiham.herokuapp.com/vote/'+isU.toString()+'/a/'+key.toString(), {headers:{"authorization": `${token}`}}).then((res) => {
            //console.log(res)
            if(res.data === 'Error communicating with DB server' || res.data === "not allowed to vote on you'r answers" || res.data === 'Already Voted'){
                alert(res.data)
            } else {
                Axios.get(`https://tiham.herokuapp.com/answers/${qid}`).then((resAns) => {
                    //console.log(resAns)
                    setItems(resAns.data)
                })
            }
        }).catch((err) => {
            if(err.response.data === "A token is required for authentication" || err.response.data === "Invalid Token"){
                alert('Please login before you vote')
                ckifloggedin(0)
            } else {
                alert('Unknown error occured')
            }
        })
    }

    return (
        <>
            <div id='linkNotify' className='notify'>Link copied to clipboard</div>
            <ReactPaginate
                breakLabel="..."
                nextLabel={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path data-v-a2c62ba0="" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                forcePage={initialpage}
                previousLabel={<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path data-v-a2c62ba0="" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>}
                renderOnZeroPageCount={null}
                containerClassName="PagQsListpagination"
                pageLinkClassName="PagQsListpagenum"
                previousLinkClassName="PagQsListpagenum"
                nextLinkClassName="PagQsListpagenum"
                activeLinkClassName="PagQsListactive"
            />
            {
                currentItems?.map((as) => {
                    let d = new Date(as.date)
                    return(
                        <div key={as.a_id}>{/*<div className='qlist anlist' key={as.a_id}>*/}
                        
                            <div style={{position:'relative'}} className='revcont'> {/* here class was : qitem*/}

                                <div style={{overflowY: 'visible'}} className='ansidcont' ref={(aid !== null && aid !== undefined && 
                                currentItems?.length !== 0 && aid.toString() === (as.a_id).toString())?(
                                    inputElement
                                ):(null)}>
                                    <img id={as.a_id} onClick={(e)=>hndlcpy(`https://coding-queries.netlify.app/questions/${qid}?aid=${as.a_id}`)} 
                                    src={copy} title='Copy link'/>
                                </div>

                                <MarkDown text={as.answer} />

                                {/* Edit answer... */}
                                {<img className='editic' onClick={(e)=>{
                                    resetEdA(as)
                                    resetBody(as.answer)
                                    resetIsediting(true)
                                    //navigate('/ask', {state:tq})
                                }} 
                                src={edit} title='Edit'/>}
                            </div>

                            <div className='sqdvcont'>
                                <button className='sqbp sqbstyle'>
                                    <img id='abp' onClick={(e)=>handlevote(e, as.a_id)}
                                    style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                                    src={voteup} />
                                </button>
                              
                                <div className='sqvcc'>{(as.votes === null)? `0 Votes`:`${as.votes} Votes` }</div>

                                <button className='sqbm sqbstyle'>
                                    <img id='abm' onClick={(e)=>handlevote(e, as.a_id)}
                                    style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                                    src={votedown} />
                                </button>

                                <div className='sqab'>
                                    <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${as.u_id}`}>
                                        {as.username} 
                                    </Link>
                                    &nbsp;answered on {d.toString().split('GMT')[0]}
                                </div>
                            </div>{/* </div> */}

                            <div style={{height:'1px', width:'100%',marginBottom:"50px",boxShadow:"0 1px 0px rgba(0,0,0,0.15),0px -1px rgba(0,0,0,0.1)"}}></div>
                        </div>
                    );
                })
            }
        </>
    );
}

export default Singleqs;