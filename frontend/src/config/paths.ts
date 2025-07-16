export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  projects: {
    path: '/projects',
    getHref: () => '/projects',
  },

  projectDetail: {
    path: '/projects/:id',
    getHref: (id: string) => `/projects/${id}`,
  },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  aboutUs: {
    path: '/about-us',
    getHref: () => '/about-us',
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/app/discussions',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      path: 'users',
      getHref: () => '/app/users',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
  },

  admin: {
    root: {
      path: '/admin',
      getHref: () => '/admin',
    },
    dashboard: {
      path: '',
      getHref: () => '/admin',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/admin/discussions',
    },
    users: {
      path: 'users',
      getHref: () => '/admin/users',
    },
    donationsSponshorships: {
      path: 'donations-sponsorships',
      getHref: () => '/admin/donations-sponsorships',
    },
  },
  requester: {
    root: {
      path: '/requester',
      getHref: () => '/requester',
    },
    dashboard: {
      path: '',
      getHref: () => '/requester',
    },
    projects: {
      path: 'projects',
      getHref: () => '/requester/projects',
    },
    createProject: {
      path: 'projects/create',
      getHref: () => '/requester/projects/create',
    },
    settings: {
      path: 'settings',
      getHref: () => '/requester/settings',
    },
  },
  developer: {
    root: {
      path: '/developer',
      getHref: () => '/developer',
    },
    dashboard: {
      path: '',
      getHref: () => '/developer',
    },
    projects: {
      path: 'projects',
      getHref: () => '/developer/projects',
    },
    settings: {
      path: 'settings',
      getHref: () => '/developer/settings',
    },
  },
} as const;
