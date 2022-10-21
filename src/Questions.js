import './bodySection.css';

import PagQsList from './PagQsList';
import { Link } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';

import {useEffect, useState} from 'react'
import {useGlobalContext} from './Context'
import Axios from 'axios'

import { options } from './Options';
import { optionsOdv } from './OptionsOdv';
import Select from 'react-select'

function Questions() {
    const {tag, resetTag, askingB, resetAskingB} = useGlobalContext()
    const [qtns, setQtns] = useState([])
    const [src, setSrc] = useState('')
    const [odrby, setOdrby] = useState('date')

    function handlesettingqtns (res){
        return new Promise((resolve, reject) => {
            setQtns(res)
            resolve()
        })
    }

    function fltr(res){
        console.log(askingB.split(' '),res.data)
        let s =askingB.split(' ')
        let a = new Set([])
        for(let i = 0; i < res.data.length; i++){
            let p = res.data[i].title.toLowerCase()
            for(let j = 0; j < s.length; j++) if(s[j] !== ''){
                if(p.includes(s[j])){
                    a.add(i)
                    break
                }
            }
            /* p = res.data[i].question.toLowerCase()
            for(let j = 0; j < s.length; j++) if(s[j] !== ''){
                if(p.includes(s[j])){
                    a.add(i)
                    break
                }
            } */
        }
        let dt = []
        a.forEach((ai) => dt.push(res.data[ai]))
        return dt
    }

    useEffect(() => {
        console.log('t ren')
        Axios.get("https://tiham.herokuapp.com/questions/tagged/" + tag.toString() + "/-1/" + odrby).then(async (res) => {
            //console.log(res.data[13].question.toLowerCase())
            try{
                let dt = (askingB === '')?res.data: fltr(res)
                const wait = await handlesettingqtns(dt)
            }catch{}
        })
    }, [tag, odrby])
    const handlesrch = (e) => {
        Axios.get("https://tiham.herokuapp.com/questions/tagged/" + tag.toString() + "/-1/" + odrby).then(async (res) => {
            console.log(res.data)
            try{
                let dt = (askingB === '')?res.data: fltr(res)
                console.log(dt)
                const wait = await handlesettingqtns(dt)
            }catch{}
        })
    }

    return(
        <div className='sec2q'>
            {/* ASK QUESTION PAGE LINK */}
            <Link to='/ask' className='asklink'>
                Ask Question
            </Link>

            <div className="wrap">
                <div className="search">
                    <input  value={askingB} type="text" className="searchTerm" placeholder="Search..." onChange={(e) => resetAskingB(e.target.value)}/>
                    <button type="submit" className="searchButton" onClick={(e)=>{handlesrch(e)}}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>

            <div className='sortsec'>
                <div style={{marginLeft:'10px', position:'relative',top:'15px'}}> Order BY </div>
                <div style={{marginLeft:'10px', position:'relative',marginTop:'10px'}}>
                    <Select isMulti={false} options={optionsOdv} defaultValue={optionsOdv.find((e)=> e.label === odrby)} onChange={(e)=>{
                        setOdrby(e.label)
                    }}/>
                </div>
                <div className='sortsecselectcont'>
                    <Select isMulti={false} options={options} defaultValue={options.find((e)=> e.label === tag)} onChange={(e)=>{
                        resetTag(e.label)
                    }}/>
                </div>
            </div>
            
            <PagQsList items={qtns}/>
            
        </div>
    );
}

export default Questions;