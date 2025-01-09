import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import confetti from 'canvas-confetti';
import { openDB } from 'idb';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { campInfo } from '../../../../assets/templates/camps';
import { termsAndConditions } from '../../../../assets/templates/terms';
import { DataSync } from '../../../../util/MinIO/ObjectStorage';
import { CampRegistrationAccordion } from '../HeroSubSections/index';

export const DB_NAME = 'STJDA_SignUp';
export const USER_STORE = 'userSignUps';

export const openSTJDADB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: '_id', autoIncrement: true });
      }
    },
  });
};

const steps = ['Personal Information', 'Camp Selection', 'Review & Submit'];

export const CampRegistrationPage = () => {

  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCamps, setSelectedCamps] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestFailed, setRequestFailed] = useState(null);
  const [disableCloseModaleButton, setDisableCloseModaleButton] = useState(true);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);  // Set initial state as open



  const [allFormData, setAllFormData] = useState({
    selectedCamps: {},
    email: '',
    guardianName: '',
    consent: false,
    registrationFormData: {}
  });


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAccordionChange = (event, expanded) => {
    setIsAccordionOpen(expanded);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAllFormData({
      selectedCamps: {},
      email: '',
      guardianName: '',
      consent: false,
      registrationFormData: {}
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const db = await openSTJDADB();
      const tx = db.transaction(USER_STORE, 'readwrite');
      const store = tx.objectStore(USER_STORE);
      
      // Check if there's existing data
      const existingData = await store.getAll();
      if (existingData.length > 0) {
        // If data exists, update the first entry
        await store.put({ ...allFormData, _id: existingData[0]._id });
      } else {
        // If no data exists, add new entry
        await store.add(allFormData);
      }
      await tx.done;

      console.log("Successfully saved data to IndexedDB");
      setSnackbarMessage("Registration saved successfully!");
      setSnackbarOpen(true);

      // Open the modal
      // when the modal opens the data from index DB is sent to the database
      setIsModalOpen(true);

      // Throw confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Wait for 2.75 seconds
      await new Promise(resolve => setTimeout(resolve, 2750));
      setDisableCloseModaleButton(false)
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setSnackbarMessage("An error occurred while saving the registration. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirect to home page after closing the modal
  };

  const handleCampChange = (event) => {
    const { name, checked } = event.target;
    setAllFormData(prevData => ({
      ...prevData,
      selectedCamps: {
        ...prevData.selectedCamps,
        [name]: checked,
      }
    }));
  };

  const getTime =() =>{
    const currentTime = new Date().toLocaleString();
    return currentTime;
  }

  const getSelectedCampNames = () => {
    return Object.entries(allFormData.selectedCamps)
    .filter(([_, isSelected]) => isSelected)
    .map(([campName, _]) => campName);
  };

  const updateAllFormData = (newData) => {
    setAllFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <>
      <Box sx={{
        alignItems: "flex-start",
        alignSelf: "stretch",
        display: "flex",
        flexDirection: 'column',
        padding: "0px 10px",
        width: "100%",
        backgroundColor: 'orange'
      }}>
        <Box sx={{
          padding: "10px",
          width: "100%"
        }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            STJDA Summer Camp Registration
          </Typography>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'pink', p: 3, borderRadius: 2 }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{ mb: 4 }}
          orientation={isMobile ? "vertical" : "horizontal"}
          alternativeLabel={!isMobile}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{isMobile ? label : <Typography variant="body2">{label}</Typography>}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ backgroundColor: 'green', p: 3, borderRadius: 2 }}>
        {activeStep === steps.length ? (
          <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ backgroundColor: 'yellow', borderRadius: 2 }}>
           {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Please fill out your personal information.
                </Typography>
                <Accordion 
                  expanded={isAccordionOpen} 
                  onChange={handleAccordionChange}
                >
                  <AccordionSummary sx={{backgroundColor: 'red'}} expandIcon={<ExpandMoreIcon />}>
                    <Typography>Personal Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CampRegistrationAccordion 
                      onFormDataChange={(data) => setAllFormData(prev => ({ ...prev, registrationFormData: data }))}
                    />
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select your desired camps:
                </Typography>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Available Camps (Select all that apply)</FormLabel>
                  <FormGroup>
                    {campInfo.map((camp) => (
                      <FormControlLabel
                        key={camp.name}
                        control={
                          <Checkbox
                            checked={allFormData.selectedCamps[camp.name] || false}
                            onChange={handleCampChange}
                            name={camp.name}
                          />
                        }
                        disabled={camp.toggle}
                        label={`${camp.name} ${camp.toggle ? ": full" : ''}`}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Box>
            )}
            {activeStep === 2 && (
              <Box className="p-4">
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Please review your information and submit
                  </Typography>
                  
                  <Accordion >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        Your Information ({Object.keys(allFormData.registrationFormData).length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                        {Object.entries(allFormData.registrationFormData).map(([key, value]) => (
                          <ListItem key={key} divider>
                            <ListItemText 
                              primary={key}
                              secondary={String(value)}
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                  
                  {selectedCamps.length === 0 && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Please select at least one camp before proceeding.
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={allFormData.email}
                    onChange={(e) => setAllFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mb-4"
                  />
                  <TextField
                    fullWidth
                    label="Legal Guardian Name"
                    variant="outlined"
                    value={allFormData.guardianName}
                    onChange={(e) => setAllFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                    className="mb-4"
                  />
                  <Box 

                    sx={{
                      height: '200px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555',
                      },
                    }}
                  >
                    {termsAndConditions.map((term, index) => (
                      <Box key={index} className="mb-4">
                        <Typography variant="body2" className="mb-2">
                          {term.english}
                        </Typography>
                        <Typography variant="body2" className="mb-2 italic">
                          {term.spanish}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                      checked={allFormData.consent}
                      onChange={(e) => setAllFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      />
                    }
                    label="I agree to the terms and conditions"
                  />
                </Grid>
              </Grid>
              <Button 
              sx={{ mt: 2}}
                variant="contained" 
                color="primary" 
                className="mt-4"
                disabled={!allFormData.email || !allFormData.guardianName || !allFormData.consent || getSelectedCampNames().length === 0}
                onClick={handleSubmit} // serialize the data and send to MinIO
              >
                Submit
              </Button>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>
            </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button 
                onClick={handleNext}
                disabled={(activeStep === 1 || activeStep === steps.length - 1) && getSelectedCampNames().length === 0}
              >
                {/* this is the outer next button */}
                {activeStep === steps.length - 1 ? '' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
        </Box>
          </Box>



    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        {requestFailed !== null && (requestFailed ? (
          <Typography id="modal-title" variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'red' }}>
            <XCircle size={24} style={{ marginRight: '8px' }} />
            Registration Failure
          </Typography>
        ) : (
          <Typography id="modal-title" variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <CheckCircle size={24} style={{ marginRight: '8px' }} />
            Registration Submitted
          </Typography>
        ))}
        <DataSync disableButton={setDisableCloseModaleButton} requestFailed={setRequestFailed} failedRequest={requestFailed}/>
        <Box sx={{ mt: 2, mb: 3 }}>
          {disableCloseModaleButton ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body1">Syncing data... <CircularProgress/> </Typography>
            </Box>
          ) : requestFailed ? (
            <Typography variant="body1" color="error">
              Registration failed. Please try again.
            </Typography>
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Last successful sync: {getTime()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                STJDA will reach out to you soon to finalize your registration process.
              </Typography>
            </>
          )}
        </Box>
        <Button 
          onClick={handleCloseModal} 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={disableCloseModaleButton}
        >
          Close
        </Button>
      </Box>
    </Modal>
    </>
  );
};