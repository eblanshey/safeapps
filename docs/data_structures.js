// "Permissions" refer to everyone unless otherwise stated (the owner by default can do anything)
const baseLocation = '/users';

// Categories
// Owner: admin
// Permissions: read
const categories = {
  1: 'a',
  2: 'b',
  3: 'c'
};
const location = '/admin/categories';

// Index of all claimed slugs. They will all be downloaded by everyone.
// Owner: admin
// Permissions: read, append
const slugs = {
  slugid: {userid, appid},
  slugid2: {userid2, appid2}
  //...
};

// User profile. Created upon signup
// Owner: user
// Permissions: read
const profile = {
  username: 'eblanshey',
  userid: 'provided_by_firebase',
  // later add other info: github, twitter, etc
}

// App lists
// Owner: admin
// Permissions: read, append-only, delete if userid matches
const location = '/admin/pendingApps/$appid';
const pendingApps = {
  userid: 'userid',
  submitted: Date.now()
}
// Permissions: read
const location = '/admin/approvedApps/$appid';
const approvedApps = {
  userid: 'userid',
  approved: Date.now()
}
// Permissions: read
const location = '/admin/deniedApps/$appid';
const deniedApps = {
  userid: 'userid',
  denied: Date.now()
}

// Apps
// Owner: submitter
// Permissions: read
const location = `/user/apps/$appid`;
// All apps will be loaded using this info -- should be minimal not to take up too much memory
const app = {
  humanName: 'SAFE Talk',
  caption: 'The place to talk about everything SAFE', // max: 100 chars
  categories: [1, 2],
  thumbnail: `$thumbId`,
}
// Loaded only when this app is being viewed. Should contain everything else
const appExtended = {
  descriptionFormat: 'text', // support markdown
  description: 'This will be a much longer description.',
  slug: 'safe-talk', // for reference
}

// Thumbnails
// Owner: submitter
// Permissions: read
const location = `/user/thumbs/$thumbid`;
const thumb = 'base64';
