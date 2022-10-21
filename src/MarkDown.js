import './bodySection.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';

/* import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c'; */
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {coyWithoutShadows,coldarkCold,base16AteliersulphurpoolLight,coy} from 'react-syntax-highlighter/dist/esm/styles/prism'

function MarkDown({text}){
    return(
        <ReactMarkdown style={{overflowWrap:"break-word"}} skipHtml={false} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm, {singleTilde: false}]} 
                components={{
                    //Rsh,
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        //console.log('in :',inline,'cl :', className,'m :', match, children)
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={coyWithoutShadows}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : ((inline && !match) ? (
                            <code style={{backgroundColor:"rgb(227, 230, 232)",borderRadius:'3px',position:"relative",display:"inline", padding:'2px 4px 2px 4px',width:'auto',height:'auto'}}>
                                {children}
                            </code>
                        ) : (
                          <code style={{backgroundColor:"rgb(246, 246, 246)",position:"relative",display:"block",width:"100%",padding:'5px',minHeight:"18.4px",
                          overflowX:'auto',overflowY:'auto',overflowWrap:'normal',maxHeight:'600px',borderRadius:'3px'}} className={className} {...props}>
                            {children}
                          </code>
                        ));
                    },
                    table: ({node, ...props}) => <div className='tcont'><table {...props} /></div>
                }}>
                    { text }
                </ReactMarkdown>
    );
}

export default MarkDown;