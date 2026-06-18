const notificationTypes = ['Placement', 'Result', 'Event'];

const baseMessages = [
  'Campus placement drive registration is now open for final-year students.',
  'Semester result for computer science batch has been published.',
  'Cultural fest schedule has been updated for all departments.',
  'Placement training workshop will begin at 3 PM in the main auditorium.',
  'Backlog examination timetable has been released for review.',
  'Sports meet final fixtures are available on the student portal.',
  'The alumni guest lecture has been moved to the central seminar hall.',
  'Hackathon team submission closes at midnight tonight.',
  'Result revaluation window is now open for 48 hours.',
  'Department-level event registration is available for all students.',
  'Recruiter shortlist updates have been posted to the notice board.',
  'Campus interview schedule has been revised for tomorrow morning.',
  'Annual day event rehearsals will begin after class hours.',
  'Placement preparation materials have been uploaded to the portal.',
  'Result analysis meeting is scheduled with academic coordinators.',
  'Guest speaker session on innovation will take place this Friday.',
  'The placement cell has shared important interview instructions.',
  'Students can now download the latest marks memo from the portal.',
  'Inter-department sports selection trials are open for registration.',
  'New event posters have been approved for campus display.',
  'Recruitment aptitude test details are now available.',
  'End-semester result correction requests are being accepted.',
  'The tech symposium agenda has been finalized.',
  'Career guidance session registration closes this evening.',
  'Internal assessment result sheets are ready for viewing.',
  'Placement orientation for pre-final students starts Monday.',
  'NSS volunteering event details have been published.',
  'A special result support desk is open at the admin block.',
  'Student innovation showcase entries are being reviewed.',
  'Final interview lists have been updated by the placement office.',
];

export const mockNotifications = Array.from({ length: 30 }, (_, index) => {
  const notificationType = notificationTypes[index % notificationTypes.length];
  const offsetMinutes = index * 17 + (index % 4) * 9;

  return {
    id: `mock-${index + 1}`,
    message: baseMessages[index],
    notification_type: notificationType,
    created_at: new Date(Date.now() - offsetMinutes * 60000).toISOString(),
  };
});