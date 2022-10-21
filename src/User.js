import './bodySection.css'

import { Link, useParams } from 'react-router-dom'

import React, { useEffect, useState } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';

import Select from 'react-select'
import { optionsUqa } from './OptionsUqa';
import { optionsOdv } from './OptionsOdv';

function User() {
    //Axios.defaults.withCredentials = true
    const { userId } = useParams() // * user id from url parameter
    const [userName, setUserName] = useState('')
    //console.log(userName)

    const [tag, setTag] = useState('questions')
    const [odrby, setOdrby] = useState('date')
    const [items, setItems] = useState([])
    //console.log(items)

    useEffect(() => {
        if(tag === 'questions'){
            Axios.get(`https://tiham.herokuapp.com/questions/${userId}/${odrby}`).then((res) => {
                console.log(res) // * getting all question
                setItems(res.data)
                setUserName(res.data[0].username)
            })
        } else {
            Axios.get(`https://tiham.herokuapp.com/questions/ans/${userId}/${odrby}`).then((res) => {
                console.log(res) // * getting all answered question
                setItems(res.data)
                setUserName(res.data[0].username)
            })
        }
    },[tag, odrby])

    return(
        <div style={{display:'block'}} className='sec2q'>
            <h3 style={{marginLeft:'30px', fontWeight:'450'}} >User : {userName}</h3>
            <div className='sortsec'>
                <div style={{marginLeft:'10px', position:'relative',top:'15px'}}> Order BY </div>
                <div style={{marginLeft:'10px', position:'relative',marginTop:'10px'}}>
                    <Select isMulti={false} options={optionsOdv} defaultValue={optionsOdv.find((e)=> e.label === odrby)} onChange={(e)=>{
                        setOdrby(e.label)
                    }}/>
                </div>
                <div className='sortsecselectcont'>
                    <Select isMulti={false} options={optionsUqa} defaultValue={optionsUqa.find((e)=> e.label === tag)} onChange={(e)=>{
                        setTag(e.label)
                    }}/>
                </div>
            </div>
            <PagUqaList Ttems={items} Ttag={tag}/>
        </div>
    );
}

function PagUqaList({Ttems, Ttag}) {
    const itemsPerPage = 20
    const tag = Ttag
    const [items, setItems] = useState([])
    const [prevtag, setPrevtag] = useState(0)

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    
    //console.log(items, tag, Ttems)
    useEffect(() => {
        setItems(Ttems)
    },[Ttems])

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


    return (
        <>
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
                currentItems?.map((qs, index) => {
                    return (
                        <div style={{position:'relative',minHeight:'50px'}} className='qlist' key={index}>
                            <div style={{paddingTop:'10px',paddingBottom:'10px'}} className='qitem'>
                                {
                                    (tag === 'questions') ? (
                                        <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.q_id}`} className='qitemL'>{qs.title}</Link>
                                    ):(
                                        <Link style={{fontSize:'15px'}} to={`/questions/${qs.q_id}?aid=${qs.a_id}`} className='qitemL'>{qs.title}</Link>
                                    )
                                }
                                
                            </div>
                        </div>
                    );  
                })
            }
        </>
    );
}

export default User;