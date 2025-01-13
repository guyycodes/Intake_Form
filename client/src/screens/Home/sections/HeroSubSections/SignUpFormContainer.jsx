import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import your camp form components here
import { RegistrationForm } from "./IntakeFormPages";


export const CampRegistrationAccordion = ({ onFormDataChange }) => {
  const [toggleAccordian, setToggleAccordian] = useState(true)
  // Array of camp objects, each containing name, description, and component
  const camps = [
    {
      name: "",
      description: toggleAccordian ? "" : "Select Next to Contine >>",
      component: RegistrationForm
    },
    // Add more camps here as needed
  ];
  const [expandedPanels, setExpandedPanels] = useState(
    camps.reduce((acc, _, index) => ({ ...acc, [`panel${index}`]: true }), {})
  );

  const closeAccordion = () => {
    setToggleAccordian(false);
    setExpandedPanels(camps.reduce((acc, _, index) => ({ ...acc, [`panel${index}`]: false }), {}));
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: isExpanded }));
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: 'auto', 
        margin: 'auto', 
        padding: 2,
        backgroundImage: 'url("https://u-static.fotor.com/images/text-to-image/result/PRO-f53d1d590d5e46b49d733ad1b86c4440.jpg")',  // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',  // This ensures the background covers the full viewport height
        '& .MuiAccordion-root': {  // This adds some transparency to the accordion
          backgroundColor: 'rgba(255, 255, 255, .95)'
        },
        border: '1px solid black',  // Added semi-transparent white border
        borderRadius: '16px',
      }}
    >
      {/* <Typography variant="h4" align="center" gutterBottom>
        Camp Registration
      </Typography> */}
      {camps.map((camp, index) => {
        const CampComponent = camp.component;
        return (
          <Accordion
            key={camp.name}
            expanded={expandedPanels[`panel${index}`]}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {camp.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{camp.description}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CampComponent       
                onFormDataChange={onFormDataChange} 
                closeAccordion={closeAccordion}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};