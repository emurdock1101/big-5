import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {traitOverviews} from '../constants/content';
import {TraitOverview} from '../constants/schema';

export default function OceanAccordion() {
  return (
    <div>
      {traitOverviews.map((trait: TraitOverview) => (
        <Accordion key={trait.trait} style={{borderLeft: `6px solid ${trait.color}`}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{width: '80%', fontSize: 18}}>{trait.trait}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {trait.paragraphs.map((paragraph, i) => (
              <div key={i}>
                <Typography>{paragraph}</Typography>
                {i < trait.paragraphs.length - 1 && <br />}
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
