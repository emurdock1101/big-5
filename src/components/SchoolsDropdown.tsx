import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {COUNTY_SCHOOLS} from '../constants/countySchools';

interface SchoolsDropdownProps {
  onChange: (event: SelectChangeEvent<string>) => void;
}
const SchoolsDropdown = (props: SchoolsDropdownProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    props.onChange(event);
    setSelectedOption(event.target.value);
  };

  return (
    <Box sx={{maxWidth: 300}}>
      <FormControl fullWidth required>
        <InputLabel>School</InputLabel>
        <Select value={selectedOption} label='School2' onChange={handleChange}>
          {COUNTY_SCHOOLS.map((school) => (
            <MenuItem key={school.id} value={school.name}>
              {school.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SchoolsDropdown;
