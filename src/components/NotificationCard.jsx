import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { formatDateTime, getNotificationTone } from '../utils/notificationHelpers';

export function NotificationCard({ notification, score, rank, onToggleRead, onOpen }) {
  const tone = getNotificationTone(notification.notificationType);
  const unread = !notification.isRead;

  return (
    <Card
      onClick={onOpen}
      sx={{
        height: '100%',
        cursor: onOpen ? 'pointer' : 'default',
        borderLeft: unread ? '5px solid' : '1px solid transparent',
        borderLeftColor: unread ? `${tone}.main` : 'transparent',
        backgroundColor: unread ? 'rgba(15, 118, 110, 0.04)' : 'background.paper',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
        },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box>
              {typeof rank === 'number' ? (
                <Chip label={`#${rank}`} size="small" color="primary" sx={{ mb: 1 }} />
              ) : null}
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {notification.title}
              </Typography>
            </Box>

            <Chip
              label={notification.isRead ? 'Read' : 'Unread'}
              color={notification.isRead ? 'default' : 'warning'}
              size="small"
              variant={notification.isRead ? 'outlined' : 'filled'}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {notification.message}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={notification.notificationType} color={tone} size="small" />
            {typeof score === 'number' ? <Chip label={`Score ${score}`} size="small" variant="outlined" /> : null}
            <Chip
              label={formatDateTime(notification.createdAt)}
              size="small"
              icon={<AccessTimeOutlinedIcon fontSize="small" />}
              variant="outlined"
            />
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'space-between' }}>
        <Button
          startIcon={notification.isRead ? <MarkEmailUnreadOutlinedIcon /> : <MarkEmailReadOutlinedIcon />}
          onClick={(event) => {
            event.stopPropagation();
            onToggleRead?.();
          }}
        >
          {notification.isRead ? 'Mark unread' : 'Mark read'}
        </Button>

        <Button
          startIcon={<OpenInNewOutlinedIcon />}
          variant="text"
          onClick={(event) => {
            event.stopPropagation();
            onOpen?.();
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}