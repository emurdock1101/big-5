import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {faqs, Faq} from '../constants/content';

export default function FaqsAccordion() {
  return (
    <div>
      {faqs.map((question: Faq) => (
        <Accordion key={question.title} style={{borderLeft: `6px solid #111840`}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{width: '80%', fontSize: 18}}>{question.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {question.paragraphs.map((p, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                <Typography>{p}</Typography>
              </React.Fragment>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
