import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { formatDateTime, getNotificationTone } from '../utils/notificationHelpers';

export function NotificationTable({
  rows,
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onToggleRead,
  onOpen,
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const startIndex = page * rowsPerPage;
  const visibleRows = safeRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Table aria-label="notifications table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(15, 23, 42, 0.04)' }}>
            <TableCell width={130}>State</TableCell>
            <TableCell>Message</TableCell>
            <TableCell width={150}>Type</TableCell>
            <TableCell width={180}>Received</TableCell>
            <TableCell width={130}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography sx={{ py: 3, color: 'text.secondary' }}>Loading notifications...</Typography>
              </TableCell>
            </TableRow>
          ) : visibleRows.length > 0 ? (
            visibleRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => onOpen?.(row)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: row.isRead ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 118, 110, 0.05)',
                }}
              >
                <TableCell>
                  <Chip
                    label={row.isRead ? 'Read' : 'Unread'}
                    color={row.isRead ? 'default' : 'warning'}
                    size="small"
                    variant={row.isRead ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {row.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {row.message}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={row.notificationType} color={getNotificationTone(row.notificationType)} size="small" />
                </TableCell>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="toggle read state"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleRead?.(row);
                    }}
                  >
                    <MarkEmailReadOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="view details"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen?.(row);
                    }}
                  >
                    <OpenInNewOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography sx={{ py: 3, color: 'text.secondary', textAlign: 'center' }}>
                  No notifications matched your current filters.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={safeRows.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />
    </TableContainer>
  );
}