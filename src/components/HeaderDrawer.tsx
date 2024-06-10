import {Button, makeStyles} from '@material-ui/core';
import {Facebook, Group, Instagram, Phone, Twitter} from '@material-ui/icons';
import {HelpCenter, PrivacyTip} from '@mui/icons-material';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import React, {useEffect, useRef} from 'react';

import Box from '@mui/material/Box';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logo.svg';
import {Auth} from 'aws-amplify';

const drawerWidth = 260;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
  backgroundColor: '#F8F7F3',
}));

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const useStyles = makeStyles((theme) => ({
  container: {
    height: 64,
  },
  linkText: {
    color: theme.palette.success.main,
    '&:hover': {
      color: theme.palette.success.dark,
    },
    textDecoration: 'underline',
    fontSize: 18,
  },
  link: {
    textDecoration: 'none',
  },
  home: {
    flexGrow: 1,
  },
  homeButton: {
    color: '#111840',
    backgroundColor: '#F8F7F3',
    width: 50,
    height: 50,
  },
  signInButton: {
    color: '#111840',
    backgroundColor: '#F8F7F3',
    width: 110,
    height: 50,
  },
  menuIcon: {
    color: '#111840',
  },
}));

interface HeaderDrawerProps {
  loggedIn: boolean;
  completed: boolean;
  onLogOut: () => void;
}

/**
 * HeaderDrawer component
 */
const HeaderDrawer = (props: HeaderDrawerProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const ref = useRef<any>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Close drawer on sidebar navigate
  const handleSidebarNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    handleDrawerClose();
    navigate(path);
  };

  // On clicking log in, redirect to Login page
  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path);
  };

  // Log out will redirect to Home
  const logOut = async (e: any) => {
    e.preventDefault();
    try {
      await Auth.signOut();
      props.onLogOut();
      handleNav('/');
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };

  const styles = useStyles();

  useEffect(() => {
    const checkIfClickedOutside = (event: any) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu

      if (open && ref.current && !ref.current.contains(event.target)) {
        handleDrawerClose();
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [open]);

  return (
    <Box sx={{display: 'flex'}} className={styles.container}>
      <CssBaseline />
      <AppBar position='absolute' open={open}>
        <Toolbar>
          <div className={styles.home}>
            <Button
              className={styles.homeButton}
              // variant="contained"
              onClick={() => handleNav('/')}>
              {<Logo />}
            </Button>
          </div>
          {
            // Show results page if logged in
            props.loggedIn && props.completed && (
              <Button className={styles.signInButton} onClick={() => handleNav('/results')}>
                RESULTS
              </Button>
            )
          }
          {
            // Log in if not already
            !props.loggedIn && (
              <Button className={styles.signInButton} onClick={() => handleNav('/login')}>
                LOG IN
              </Button>
            )
          }
          {
            // Logout if logged in already
            props.loggedIn && (
              <Button className={styles.signInButton} onClick={logOut}>
                LOG OUT
              </Button>
            )
          }
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='end'
            onClick={handleDrawerOpen}
            sx={{...(open && {display: 'none'})}}>
            <MenuIcon className={styles.menuIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant='persistent'
        anchor='right'
        open={open}
        ref={ref}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <div style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSidebarNav('/about')}>
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary={'Our team'} />
              </ListItemButton>
            </ListItem>
          </div>
          <div style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSidebarNav('/faqs')}>
                <ListItemIcon>
                  <HelpCenter />
                </ListItemIcon>
                <ListItemText primary={'FAQs'} />
              </ListItemButton>
            </ListItem>
          </div>
          <div style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSidebarNav('/contact')}>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary={'Contact us'} />
              </ListItemButton>
            </ListItem>
          </div>
          <div style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSidebarNav('/privacy')}>
                <ListItemIcon>
                  <PrivacyTip />
                </ListItemIcon>
                <ListItemText primary={'Privacy'} />
              </ListItemButton>
            </ListItem>
          </div>
        </List>
        <Divider />
        <List>
          <a
            href='https://www.facebook.com/DiscoverPersonalityPlus/'
            target='_blank'
            rel='noopener noreferrer'
            style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Facebook />
                </ListItemIcon>
                <ListItemText primary={'Facebook'} />
              </ListItemButton>
            </ListItem>
          </a>
          <a
            href='https://instagram.com/discover_personalityplus'
            target='_blank'
            rel='noopener noreferrer'
            style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Instagram />
                </ListItemIcon>
                <ListItemText primary={'Instagram'} />
              </ListItemButton>
            </ListItem>
          </a>
          <a
            href='https://twitter.com/PersonalityB5'
            target='_blank'
            rel='noopener noreferrer'
            style={{color: '#1b1d21', textDecoration: 'none'}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Twitter />
                </ListItemIcon>
                <ListItemText primary={'Twitter'}></ListItemText>
              </ListItemButton>
            </ListItem>
          </a>
        </List>
      </Drawer>
    </Box>
  );
};

export default HeaderDrawer;
