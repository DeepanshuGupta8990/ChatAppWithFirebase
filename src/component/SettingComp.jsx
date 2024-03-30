import React, { useState } from 'react'
import styled from 'styled-components';
import { Typography } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import KeyIcon from '@mui/icons-material/Key';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function SettingComp() {
    const [settingState, setSettingState] = useState("general");
  return (
    <SettingCont>

      <LeftSettingComp>

        <TopLeftOption> 

          <SettingOption onClick={()=>{setSettingState("general")}}>
            <ComputerIcon/>
            <Typography variant="h6" component="h6">General</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("account")}}>
            <KeyIcon/>
            <Typography variant="h6" component="h6">Account</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("chats")}}>
            <WhatsAppIcon/>
            <Typography variant="h6" component="h6">Chats</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("personalization")}}>
            <DisplaySettingsIcon/>
            <Typography variant="h6" component="h6">Theme</Typography>
          </SettingOption>
          <SettingOption onClick={()=>{setSettingState("help")}}>
            <InfoIcon/>
            <Typography variant="h6" component="h6">Help</Typography>
          </SettingOption>
        
        </TopLeftOption>

        <SettingOption onClick={()=>{setSettingState("help")}}>
          <ManageAccountsIcon/>
          <Typography variant="h6" component="h6">Profile</Typography>
        </SettingOption>

      </LeftSettingComp>

      <RightSettingComp>

      </RightSettingComp>

    </SettingCont>
  )
}

const SettingCont = styled.div`
 display: flex;
 flex-direction: row;
 width: 100%;
 height: 100%;
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

const General = ()=>{
    return(
      <>
      </>
    )
  }