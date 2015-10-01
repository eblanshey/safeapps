let store = {
  messages: {
    success: [
      {
        //autoClose: true, // true or false, not needed for now
        text: 'You have created a profile!'
      },
    ],
    error: [] // same as successMessages
  },
  entities: {
    thumbnails: {
      thumbnailid: {
        isLoading: false,
        didInvalidate: false,
        data: thumbnail_base64
      }
    },
    profiles: {
      myuserid: {
        isLoading: false,
        didInvalidate: false,
        data: profile.json
      }
    },
    apps: {
      appId: {
        isLoading: false,
        didInvalidate: false,
        data: app.json
      }
    }
  },
  collections: {
    admins: {
      isLoading: false,
      data: admins.json
    },
    stages: {
      isLoading: false,
      didInvalidate: false,
      data: stages.json
    },
    categories: {
      isLoading: false,
      didInvalidate: false,
      data: categories.json
    },
    approvedApps: {
      isLoading: false,
      didInvalidate: false,
      data: approvedApps.json
    },
    deniedApps: {
      isLoading: false,
      didInvalidate: false,
      data: deniedApps.json
    },
    pendingApps: {
      isLoading: false,
      didInvalidate: false,
      data: pendingApps.json
    }
  },
  auth: {
    isLoggedIn: false,
    isLoggingIn: false,
    authData: null,
    isAdmin: false
  },
  signup: {
    isSigningUp: false,
    didCreateLogin: false
  }
};