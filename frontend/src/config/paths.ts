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
    threadList: {
      path: '/projects/:id/threads',
      getHref: (id: string) => `/projects/${id}/threads`,
    },
    threadDetail: {
      path: '/projects/:id/threads/:threadId',
      getHref: (id: string, threadId: string) =>
        `/projects/${id}/threads/${threadId}`,
    },
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
    projectApprovals: {
      path: 'project-approvals',
      getHref: () => '/admin/project-approvals',
    },
  },

  sponsor: {
    root: {
      path: '/sponsor',
      getHref: () => '/sponsor',
    },
    dashboard: {
      path: '',
      getHref: () => '/sponsor',
    },
    donationsSponshorships: {
      path: 'donations-sponsorships',
      getHref: () => '/sponsor/donations-sponsorships',
    },
    profile: {
      path: 'profile',
      getHref: () => '/sponsor/profile',
    },
    settings: {
      path: 'settings',
      getHref: () => '/sponsor/settings',
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
    sponsorships: {
      path: 'sponsorships',
      getHref: () => '/requester/sponsorships',
    },
    profile: {
      path: 'profile',
      getHref: () => '/requester/profile',
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
    sponsorships: {
      path: 'sponsorships',
      getHref: () => '/developer/sponsorships',
    },
    profile: {
      path: 'profile',
      getHref: () => '/developer/profile',
    },
    settings: {
      path: 'settings',
      getHref: () => '/developer/settings',
    },
  },
  payments: {
    root: {
      path: '/payments',
      getHref: () => '/payments',
    },
    testPayment: {
      path: 'test',
      getHref: () => '/payments/test',
    },
  },
} as const;
