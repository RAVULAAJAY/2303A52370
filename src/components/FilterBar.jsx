import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Log } from '../services/logger';
import { NOTIFICATION_TYPES } from '../utils/notificationHelpers';

export function FilterBar({ searchValue, typeValue, onSearchChange, onTypeChange, onReset }) {
  const handleSearch = async (event) => {
    await Log('frontend', 'info', 'filter', 'User changed the notification search query');
    onSearchChange(event.target.value);
  };

  const handleType = async (event) => {
    await Log('frontend', 'warn', 'filter', `User selected ${event.target.value} filter`);
    onTypeChange(event.target.value);
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 4 }}>
      <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} alignItems={{ lg: 'center' }}>
        <TextField
          fullWidth
          value={searchValue}
          onChange={handleSearch}
          label="Search by message"
          placeholder="Search notification content"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ minWidth: { xs: '100%', lg: 220 } }}>
          <FormControl fullWidth>
            <InputLabel id="notification-type-label">Type</InputLabel>
            <Select
              labelId="notification-type-label"
              value={typeValue}
              label="Type"
              onChange={handleType}
            >
              {NOTIFICATION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="outlined" onClick={onReset} sx={{ minWidth: 136 }}>
          Reset filters
        </Button>
      </Stack>
    </Paper>
  );
}