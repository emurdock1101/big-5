import * as React from 'react';
import {makeStyles} from '@material-ui/core';
import {Facebook, GitHub, Instagram, Web, Twitter, LinkedIn} from '@material-ui/icons';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {about} from '../constants/content';
import elliot from '../images/elliot.jpeg';
import patrick from '../images/patrick.jpeg';
import {styled} from '@mui/material/styles';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const {expand, ...other} = props;
  return <IconButton {...other} />;
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const useStyles = makeStyles((theme) => ({
  phoneLink: {
    marginTop: 40,
    display: 'flex',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    color: theme.palette.info.main,
    justifyItems: 'middle',
    width: 310,
  },
  reachOut: {
    marginTop: 20,
  },
  phone: {
    fontSize: 35,
    marginRight: 20,
  },
  number: {
    fontSize: 25,
  },
  socialLinks: {
    marginLeft: -10,
    marginTop: 60,
  },
  part1: {
    color: theme.palette.info.main,
  },
  icon: {
    fontSize: 30,
    color: theme.palette.info.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  link: {
    textDecoration: 'none',
  },
}));

interface AboutCardProps {
  member: string;
}

const AboutCard = (props: AboutCardProps) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const styles = useStyles();
  return (
    <Card>
      <CardMedia
        component='img'
        height='350'
        image={props.member === 'elliot' ? elliot : patrick}
        alt='our developer'
      />
      <CardContent>
        <Typography variant='subtitle1' className={styles.part1}>
          {about[props.member].paragraphs[0]}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {props.member === 'elliot' && (
          <React.Fragment>
            <a className={styles.link} href='https://github.com/emurdock1101' target='_blank' rel='noreferrer'>
              <IconButton aria-label="elliot's github">
                <GitHub className={styles.icon} />
              </IconButton>
            </a>
            <a
              className={styles.link}
              href='https://www.linkedin.com/in/elliot-murdock-675970161/'
              target='_blank'
              rel='noreferrer'>
              <IconButton aria-label="elliot's LinkedIn">
                <LinkedIn className={styles.icon} />
              </IconButton>
            </a>
            <a className={styles.link} href='https://www.elliotchanningmurdock.com/' target='_blank' rel='noreferrer'>
              <IconButton aria-label="elliot's website">
                <Web className={styles.icon} />
              </IconButton>
            </a>
          </React.Fragment>
        )}
        {props.member === 'patrick' && (
          <React.Fragment>
            <a
              className={styles.link}
              href='https://www.facebook.com/DiscoverPersonalityPlus/'
              target='_blank'
              rel='noreferrer'>
              <IconButton aria-label="patrick's facebook">
                <Facebook className={styles.icon} />
              </IconButton>
            </a>
            <a
              className={styles.link}
              href='https://instagram.com/discover_personalityplus'
              target='_blank'
              rel='noreferrer'>
              <IconButton aria-label="patrick's instagram">
                <Instagram className={styles.icon} />
              </IconButton>
            </a>
            <a className={styles.link} href='https://twitter.com/PersonalityB5' target='_blank' rel='noreferrer'>
              <IconButton aria-label="patrick's twitter">
                <Twitter className={styles.icon} />
              </IconButton>
            </a>
          </React.Fragment>
        )}
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
          <ExpandMoreIcon fontSize='large' className={styles.icon} />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography variant={'subtitle2'}>{about[props.member].paragraphs[1]}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AboutCard;
