export const LOGIN = {
  postLogin: "/panel-login",
  forgotpassword: "/panel-send-password",
};
export const PANEL_CHECK = {
  getPanelStatus: "/panel-check-status",
};
export const PROFILE = {
  profile: "/panel-fetch-profile",
  updateprofile: "/panel-update-profile",
};
export const CHANGE_PASSWORD_API = {
  create: "/panel-change-password",
};
export const ABOUT_US = {
  fetch: "/panel-fetch-about-us",
  create: "/panel-create-about-us",
  update: "/panel-update-about-us",
};
export const MISSION_VISION = {
  fetch: "/panel-fetch-mission-vision",
  create: "/panel-create-mission-vision",
  update: "/panel-update-mission-vision",
};
export const MEETING_API = {
  activeList: "/panel-fetch-active-meeting-list",
  inactiveList: "/panel-fetch-inactive-meeting-list",
  byId: (id) => `/panel-fetch-meeting-by-id/${id}`,
  create: "/panel-create-meeting",
  update: (id) => `/panel-update-meeting/${id}`,
  updateAttendance: (id) => `/panel-update-meeting-attendance/${id}`,
};

export const MEMBER_API = {
  fetchMembers: "/panel-fetch-members",
  fetchActiveMembers: "/panel-fetch-active-member",
};

export const ONETOONE_API = {
  list: "/panel-fetch-onetoone-list",
  create: "/panel-create-onetoone",
  byId: (id) => `/panel-fetch-onetoone-by-id/${id}`,
  update: (id) => `/panel-update-onetoone/${id}`,
  delete: (id) => `/panel-delete-onetoone/${id}`,
};

export const TEAM_API = {
  list: "/panel-fetch-team-list",
  create: "/panel-create-team",
  byId: (id) => `/panel-fetch-team-by-id/${id}`,
  update: (id) => `/panel-update-team/${id}`,
  delete: (id) => `/panel-delete-team/${id}`,
};

export const GUEST_API = {
  list: "/panel-fetch-guest-list",
  create: "/panel-create-guest",
  byId: (id) => `/panel-fetch-guest-by-id/${id}`,
  update: (id) => `/panel-update-guest/${id}`,
  delete: (id) => `/panel-delete-guest/${id}`,
};

export const BONUS_POINT_API = {
  list: "/panel-fetch-bonus-point-list",
  create: "/panel-create-bonus-point",
  byId: (id) => `/panel-fetch-bonus-point-by-id/${id}`,
  update: (id) => `/panel-update-bonus-point/${id}`,
  delete: (id) => `/panel-delete-bonus-point/${id}`,
};

export const LEADS_API = {
  list: "/panel-fetch-lead-list",
  byId: (id) => `/panel-fetch-lead-by-id/${id}`,
  create: "/panel-create-lead",
  update: (id) => `/panel-update-lead/${id}`,
};

export const ENQUIRY_API = {
  fetch: "/panel-fetch-enquiry",
};

export const PORTFOLIO_API = {
  fetch: "/panel-fetch-slider",
  update: (id) => `/panel-update-slider/${id}`,
};

export const FEEDBACK_API = {
  fetch: "/panel-fetch-feedback",
  delete: (id) => `/panel-delete-feedback/${id}`,
};

export const CONTACT_API = {
  fetch: "/panel-fetch-contact",
  delete: (id) => `/panel-delete-contact/${id}`,
};

export const SHARE_USER_API = {
  list: "/panel-fetch-share-list",
  byId: (id) => `/panel-fetch-share-by-id/${id}`,
};

export const DOWNLOAD_API = {
  member: "/download-member-report",
  mobileUser: "/download-mobile-user-report",
};
export const DASHBOARD_API = {
  list:"/panel-dashboard",
};
export const ACTIVITY_API = {
  list:"/panel-fetch-activity",
};

export const USER_API = {
  new: "/panel-fetch-new-profile",
  active: "/panel-fetch-active-profile",
  inactive: "/panel-fetch-inactive-profile",
  mobile: "/panel-fetch-mobile-profile",
  byId: (id) => `/panel-fetch-profile-by-id/${id}`,
  update: (id) => `/panel-update-profile/${id}`,
  delete: (id) => `/panel-delete-profile/${id}`,
  deleteMobile: (id) => `/panel-delete-contact/${id}`,
  activate: (id) => `/panel-update-new-profile/${id}`,
  inactivate: (id) => `/panel-update-active-profile/${id}`,
  reactivate: (id) => `/panel-update-inactive-profile/${id}`,
  makeGold: (id) => `/panel-update-details/${id}`,
  updateSubGroup: (id) => `/panel-update-user-group/${id}`,
  fetchPType: "/panel-fetch-user-p_type",
  updatePType: (id) => `/panel-update-user-ptype/${id}`,
  updateJoiningDetails: (id) => `/panel-update-user-new-joining/${id}`,
};

export const REPORT_API = {
  attendance: "/fetch-member-attendance-report",
};