import React from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import SettingsIcon from '@mui/icons-material/Settings';
import ArchiveIcon from '@mui/icons-material/Archive';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingComp from './SettingComp';

export default function SideBarOptions() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <SettingPoppup>
      {/* <Button size="small" sx={{ color: "black" }} onClick={handleClose}>
        Logout
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="black"
        onClick={handleClose}
        sx={{position:"absolute",right:"5px",top:"5px"}}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <SettingComp/>
    </SettingPoppup>
  );

  return (
    <>
      <SideBarOptionContainer>
        <TopFakeLine></TopFakeLine>
        <SideBarOptionsContainerChild1>
          <Tooltip title="Chats" placement="right">
            <StyledIconDiv>
              <ChatIcon sx={{ cursor: 'pointer' }} />
            </StyledIconDiv>
          </Tooltip>
          <Tooltip title="Calls" placement="right">
            <StyledIconDiv>
              <LocalPhoneIcon sx={{ cursor: 'pointer' }} />
            </StyledIconDiv>
          </Tooltip>
          <Tooltip title="Status" placement="right">
            <StyledIconDiv>
              <PhotoLibraryIcon sx={{ cursor: 'pointer' }} />
            </StyledIconDiv>
          </Tooltip>
        </SideBarOptionsContainerChild1>

        <SideBarOptionsContainerChild2>
          <Tooltip title="Archive" placement="right">
            <StyledIconDiv>
              <ArchiveIcon sx={{ cursor: 'pointer' }} />
            </StyledIconDiv>
          </Tooltip>
          <Tooltip title="Settings" placement="right">
            <StyledIconDiv onClick={handleClick}>
              <SettingsIcon sx={{ cursor: 'pointer' }} />
            </StyledIconDiv>
          </Tooltip>
        </SideBarOptionsContainerChild2>
        <SnackBarItem
          open={open}
          autoHideDuration={60000}
          onClose={handleClose}
          // message="Want to logout"
          action={action}
        />
      </SideBarOptionContainer>
    </>
  )
}

const SideBarOptionsContainerChild1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`
const SideBarOptionsContainerChild2 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`

const SideBarOptionContainer = styled.div`
  width: 16%;
  padding-top: 60px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f3f3f3;
`

const TopFakeLine = styled.div`
  width: 100%;
  background-color: #f3f3f3;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 4px;
`

const SettingPoppup = styled.div`
  background-color: pink;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: -0%;
`

const SnackBarItem = styled(Snackbar)`
  .css-1eqdgzv-MuiPaper-root-MuiSnackbarContent-root {
    height: 450px;
    width: 400px;
  }
`

const StyledIconDiv = styled.div`
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
