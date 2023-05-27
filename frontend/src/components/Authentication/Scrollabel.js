import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin,isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const Scrollabel = ({messages}) => {
    const {user}=ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i)=>(
            <div style={{display:"flex"}} key={m._id}>
                {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && 
               ( <Tooltip
                label={m.sender.name}
                placement={"bottom-start"}
                hasArrow
                >
                    <Avatar 
                       name={m.sender.name}
                       src={m.sender.pic}
                       mt="7px"
                       size="sm"
                       cursor={"pointer"}
                    />
                    </Tooltip>)}

                    <span 
                    style={{
                      backgroundColor: `${
                        m.sender._id===user._id?"#bee3f8":"#b9f5d0"
                      }`,
                      borderRadius:"20px",
                      padding:"5px 15px",
                      maxWidth:"75%",
                      marginLeft: isSameSenderMargin(messages,m,i,user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    }}
                    >
                     {m.content}
                    </span>
            </div>

        )
          
        )}
    </ScrollableFeed>
  )
}

export default Scrollabel


// {messages &&
//   messages.map((m, i) => (
//     <div style={{ display: "flex" }} key={m._id}>
//       {(isSameSender(messages, m, i, user._id) ||
//         isLastMessage(messages, i, user._id)) && (
//         <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//           <Avatar
//             mt="7px"
//             mr={1}
//             size="sm"
//             cursor="pointer"
//             name={m.sender.name}
//             src={m.sender.pic}
//           />
//         </Tooltip>
//       )}
//       <span
//         style={{
//           backgroundColor: `${
//             m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
//           }`,
//           marginLeft: isSameSenderMargin(messages, m, i, user._id),
//           marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//           borderRadius: "20px",
//           padding: "5px 15px",
//           maxWidth: "75%",
//         }}
//       >
//         {m.content}
//       </span>
//     </div>
//   ))}