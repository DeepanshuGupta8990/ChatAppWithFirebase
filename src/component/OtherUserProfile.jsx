import React, { useState } from 'react'
import styled from 'styled-components';
import { Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import { useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export default function OtherUserProfile({handleOpen}) {
    const [settingState, setSettingState] = useState("overview");
    const currentChatUserInfo = useSelector(state => state.userRdx.currentChatUserInfo);
  return (
    <SettingCont>

      <LeftSettingComp>

        <TopLeftOption> 

          <SettingOption onClick={()=>{setSettingState("overview")}}>
            <InfoIcon/>
            <Typography variant="h6" component="h6">Overview</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("media")}}>
            <PermMediaIcon/>
            <Typography variant="h6" component="h6">Media</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("files")}}>
            <InsertDriveFileIcon/>
            <Typography variant="h6" component="h6">Files</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("links")}}>
            <LinkIcon/>
            <Typography variant="h6" component="h6">Links</Typography>
          </SettingOption>
        
        </TopLeftOption>

      </LeftSettingComp>

      <RightSettingComp>
       {
        settingState === 'overview' && <Overview handleOpen={handleOpen}/>
       }
      </RightSettingComp>

    </SettingCont>
  )
}

const SettingCont = styled.div`
 display: flex;
 flex-direction: row;
 width: 400px;
 height: 450px;
`
const LeftSettingComp = styled.div`
 width: 40%;
 height: calc(100% - 20px);
 background-color: #f2f1f1;
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 10px 0px;
 justify-content: space-between;
`
const TopLeftOption = styled.div`
 width: 100%;
 background-color: #f2f1f1;
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 5px;
 
`
const RightSettingComp = styled.div`
 width: 60%;
 height: 100%;
 background-color: #ffffff;
`
const SettingOption = styled.div`
 display: flex;
 flex-direction: row;
 gap: 10px;
 align-items: center;
 color: black;
 width: calc(85% - 10px);
 border-radius: 6px;
 background-color: #ede7e7;
 cursor: pointer;
 padding: 2px 10px;
 &:hover{
     background-color: #dacdcd;
 }
`

const Overview = ({handleOpen})=>{
  const currentChatUserInfo = useSelector(state => state.userRdx.currentChatUserInfo);
    return(
      <>
         {
         currentChatUserInfo.imageUrl ? (<ImageBlock3  onClick={()=>{handleOpen(currentChatUserInfo.imageUrl)}}><img src={currentChatUserInfo.imageUrl} height='100px'/></ImageBlock3>) : ( <ImageBlock3><AccountCircleIcon sx={{fontSize:'100px'}}/></ImageBlock3>)
        }
      </>
    )
  }

  const ImageBlock3 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    overflow: hidden;
`