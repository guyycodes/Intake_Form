import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    MenuItem,
    Select,
    Step, StepLabel,
    Stepper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formQuestions } from '../../../../../assets/templates/formQuestions';

export const RegistrationForm = ({ onFormDataChange, closeAccordion }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmit = () => {
    console.log('closeAccordion called');
    console.log('formData:', formData);
    onFormDataChange(formData);
    closeAccordion();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
        return (
          <TextField
            key={field.name}
            fullWidth
            margin="normal"
            name={field.name}
            helperText={field.label}
            type={field.type}
            InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
            size={isMobile ? "small" : "medium"}
          />
        );
      case 'textarea':
        return (
          <TextField
            key={field.name}
            fullWidth
            margin="normal"
            name={field.name}
            label={field.label}
            multiline
            rows={isMobile ? 3 : 4}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
            size={isMobile ? "small" : "medium"}
          />
        );
      case 'select':
        return (
          <FormControl key={field.name} fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
            <Select
              name={field.name}
              multiple={field.multiple}
              onChange={handleInputChange}
              value={formData[field.name] || (field.multiple ? [] : '')}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{field.label}</FormHelperText>
          </FormControl>
        );
      case 'checkbox':
        return (
          <Box key={field.name} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2">{field.label}</Typography>
            {field.options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    name={`${field.name}.${option.value}`}
                    onChange={handleInputChange}
                    checked={formData[`${field.name}.${option.value}`] || false}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={<Typography variant={isMobile ? "body2" : "body1"}>{option.label}</Typography>}
              />
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  const renderStep = (step) => {
    const section = formQuestions[step];
    return (
      <Box sx={{ mt: isMobile ? 1 : 2, mb: isMobile ? 1 : 2 }}>
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: isMobile ? 1 : 2 }}>{section.section}</Typography>
        {section.fields.map((field) => renderField(field))}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: isMobile ? '100%' : 600, 
      margin: 'auto', 
      padding: isMobile ? 1 : 2 
    }}>
      <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
        Register Here
      </Typography>
      <Stepper 
        activeStep={activeStep} 
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: isMobile ? 1 : 2 }}
      >
        {formQuestions.map((section, index) => (
          <Step key={section.section}>
            <StepLabel>
              <Typography variant={isMobile ? "body2" : "body1"}>{section.section}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: isMobile ? 1 : 2 }}>
        {renderStep(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: isMobile ? 1 : 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
            size={isMobile ? "small" : "medium"}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button 
            onClick={activeStep === formQuestions.length - 1 ? handleSubmit : handleNext}
            size={isMobile ? "small" : "medium"}
          >
            {activeStep === formQuestions.length - 1 ? 'Continue' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};