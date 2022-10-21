import { useState, useEffect } from "react";
import './bodySection.css';
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import copy from './copy.png'
import {useGlobalContext} from './Context'

function PagQsList(props) {
    // prevtag => last (most recent) selected page... It resets when specific page number is clicked..
    // If prevtag is greater than page count of 'items', first page is displayed and prevtag is not changed..
    const {prevtag, resetPrevtag} = useGlobalContext()
    const {items} = props

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    
    const itemsPerPage = 10

//    console.log("pag rend", pageCount, itemOffset, "initpage: ", initialpage, items)

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
            resetPrevtag(event.selected)
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
        //console.log(key,document.getElementById('linkcpyNotify').classList)
        navigator.clipboard.writeText(lnk).then(()=>{
            if(!document.getElementById('linkcpyNotify').classList.contains('show')){
                document.getElementById('linkcpyNotify').classList.add('show')
                  setTimeout(() => {
                      document.getElementById('linkcpyNotify').classList.remove('show')
                }, 2000);
            }
        })
    }

    return (
        <>
            <div id='linkcpyNotify' className='notify'>Link copied to clipboard</div>
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
                currentItems?.map((qs) => {
                    let d = new Date(qs.created)
                    console.log(qs)
                    return(
                        <div style={{position:'relative'}} className='qlist' key={qs.q_id}>
                            <div className='ansidcont'>
                                <img onClick={(e)=>hndlcpy(`https://coding-queries.netlify.app/questions/${qs.q_id}`)} 
                                src={copy} title='Copy link'/>
                            </div>
                            <div className='qitem'>
                                <Link onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.q_id}`} state={{qs:qs, isf:false}} className='qitemL'>{qs.title}</Link>
                            </div>
                            <div className='vitem'>
                                <div className='vts'>
                                    {(qs.votes === null)? (<>0 Votes</>):(<>{qs.votes} Votes</>)}
                                </div>
                                <div className='titem'>{qs.tag}</div>
                            </div>
                            <div className='whitem'>
                                <>
                                    <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${qs.u_id}`}>
                                        {qs.username} 
                                    </Link>
                                    &nbsp;asked on {d.toString().split('GMT')[0]}
                                </>
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
}

export default PagQsList;