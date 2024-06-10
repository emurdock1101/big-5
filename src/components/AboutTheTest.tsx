import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Typography, makeStyles, Paper} from '@material-ui/core';
import content from '../constants/content';
import MenuBook from '@mui/icons-material/MenuBook';
import Timer from '@mui/icons-material/Timer';
import Equalizer from '@mui/icons-material/Equalizer';
import {useEffect, useState} from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{paddingTop: 30, paddingBottom: 30}}>{children}</Box>}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AboutTheTest: React.FC = () => {
  const [value, setValue] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const useStyles = makeStyles((theme) => ({
    tabs: {
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 3,
      },
      '& .MuiTab-root.Mui-selected': {
        color: theme.palette.primary.main,
      },
      '& .MuiTab-root': {
        paddingRight: isMobile ? 15 : 25,
        paddingLeft: isMobile ? 15 : 25,
        fontSize: isMobile ? 10 : 15,
      },
    },
    info: {
      fontWeight: 300,
      color: theme.palette.info.main,
    },
    tab: {
      paddingLeft: 200,
    },
    aboutTestTitle: {
      fontWeight: 380,
      font: 'Monaco',
      fontSize: isMobile ? 30 : 50,
      marginBottom: 30,
      textAlign: 'center',
      color: theme.palette.info.main,
    },
    paper: {
      color: theme.palette.info.main,
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#F8F7F3',
      borderLeft: `6px solid ${theme.palette.primary.main}`,
    },
    tabBox: {
      borderBottom: '1px solid lightgrey',
      borderColor: 'divider',
    },
  }));

  // choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  const styles = useStyles();

  return (
    <Paper elevation={2} className={styles.paper}>
      <Typography variant='h3' className={styles.aboutTestTitle}>
        About the test
      </Typography>
      <Box>
        <Box className={styles.tabBox}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' className={styles.tabs} centered>
            <Tab label={isMobile ? '' : 'LENGTH'} {...a11yProps(0)} icon={<Timer />} className={styles.tab} />
            <Tab label={isMobile ? '' : 'RESULTS'} {...a11yProps(1)} icon={<Equalizer />} className={styles.tab} />
            <Tab label={isMobile ? '' : 'BACKGROUND'} {...a11yProps(2)} icon={<MenuBook />} className={styles.tab} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Typography variant='subtitle1' className={styles.info}>
            {content['aboutTheTest']['length']}
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant='subtitle1' className={styles.info}>
            {content['aboutTheTest']['results']}
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant='subtitle1' className={styles.info}>
            {content['aboutTheTest']['background']}
          </Typography>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default AboutTheTest;
