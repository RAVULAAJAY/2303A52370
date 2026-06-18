import { ToggleButton, ToggleButtonGroup, Paper, Stack, Typography } from '@mui/material';
import { Log } from '../services/logger';

const priorityOptions = [10, 15, 20, 25];

export function PrioritySelector({ value, onChange }) {
  const handleChange = async (_, nextValue) => {
    if (!nextValue) {
      return;
    }

    await Log('frontend', 'info', 'priority', `User selected Top ${nextValue}`);
    onChange(nextValue);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Priority window</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Priority score = (weight × 1000) - age in minutes. Placement outranks Result, which outranks Event.
        </Typography>

        <ToggleButtonGroup exclusive color="primary" value={value} onChange={handleChange}>
          {priorityOptions.map((option) => (
            <ToggleButton key={option} value={option} sx={{ px: 3, py: 1.2 }}>
              Top {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}