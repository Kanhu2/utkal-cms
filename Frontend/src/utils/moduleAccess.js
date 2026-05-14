export const ADMIN_MODULES = [
  'dashboard',
  'notice',
  'tender',
  'events & news',
  'publication',
  'faculty',
  'ilms',
  'research project',
  'workshop/ seminar details',
  'achievements',
  'research scholars',
  'research supervisors',
  'photo gallery'
];

const MODULE_ALIASES = {
  dashboard: 'dashboard',
  notice: 'notice',
  notices: 'notice',
  tender: 'tender',
  tenders: 'tender',
  news: 'events & news',
  event: 'events & news',
  events: 'events & news',
  'news event': 'events & news',
  'news events': 'events & news',
  'event news': 'events & news',
  'events news': 'events & news',
  'events & news': 'events & news',
  'news & events': 'events & news',
  'news-events': 'events & news',
  'news_events': 'events & news',
  'events-news': 'events & news',
  'events_news': 'events & news',
  publications: 'publication',
  'research-project': 'research project',
  'research_project': 'research project',
  ilms: 'ilms',
  'workshop seminar details': 'workshop/ seminar details',
  'workshop-seminar-details': 'workshop/ seminar details',
  'workshop_seminar_details': 'workshop/ seminar details',
  'workshop/ seminar details': 'workshop/ seminar details',
  achievement: 'achievements',
  awards: 'achievements',
  award: 'achievements',
  'research-scholars': 'research scholars',
  'research_scholars': 'research scholars',
  'research-supervisors': 'research supervisors',
  'research_supervisors': 'research supervisors',
  gallery: 'photo gallery',
  'photo-gallery': 'photo gallery',
  'photo_gallery': 'photo gallery',
};

export const normalizeModuleName = (moduleName) => {
  const normalized = String(moduleName || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');

  return MODULE_ALIASES[normalized] || normalized;
};

export const getAssignedModules = (assignedModules) => {
  const modules = Array.isArray(assignedModules)
    ? assignedModules
    : String(assignedModules || '').split(',');

  return modules
    .map(normalizeModuleName)
    .filter(Boolean);
};

export const getAllowedPages = (user) => {
  if (!user) {
    return [];
  }

  if (String(user.role || '').toLowerCase() === 'admin') {
    return ADMIN_MODULES;
  }

  // return getAssignedModules(user.assigned_modules);
  const employeeModules = getAssignedModules(user.assigned_modules);

  // Always allow dashboard
  return ['dashboard', ...employeeModules];
};

export const canAccessPage = (user, page) =>
  getAllowedPages(user).includes(normalizeModuleName(page));
