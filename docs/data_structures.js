// "Permissions" refer to everyone unless otherwise stated (the owner by default can do anything)
let baseLocation = '/users';

// Categories
// Owner: admin
// Permissions: read
let location = '/admin/categories';
let categories = {
  1: 'a',
  2: 'b',
  3: 'c'
};

// Claimed slugs.
// Owner: admin
// Permissions: read, append
let location = '/admin/slugs/$slug';
let slug = {userid, appid};

// User profile. Created upon signup
// Owner: user
// Permissions: read
let location = '/user/profile'
let profile = {
  username: 'eblanshey',
  userid: 'provided_by_firebase'
  // later add other info: github, twitter, etc
}

// App lists
// Owner: admin
// Permissions: read, append-only, delete if userid matches
let location = '/admin/pendingApps/$appid';
let pendingApps = {
  userid: 'userid',
  submitted: Date.now()
}
// Permissions: read
let location = '/admin/approvedApps/$appid';
let approvedApps = {
  userid: 'userid',
  approved: Date.now()
}
// Permissions: read
let location = '/admin/deniedApps/$appid';
let deniedApps = {
  userid: 'userid',
  denied: Date.now()
}

// Apps
// Owner: submitter
// Permissions: read
let location = `/user/apps/$appid`;
// All apps will be loaded using this info -- should be minimal not to take up too much memory
let app = {
  humanName: 'SAFE Talk',
  caption: 'The place to talk about everything SAFE', // max: 100 chars
  categories: [1, 2],
  thumbnail: `$thumbId`
}
// Loaded only when this app is being viewed. Should contain everything else
let appExtended = {
  descriptionFormat: 'text', // support markdown
  description: 'This will be a much longer description.',
  slug: 'safe-talk' // for reference
}

// Thumbnails
// Owner: submitter
// Permissions: read
let location = `/user/thumbs/$thumbid`;
let thumb = 'base64';
