import Firebase from 'firebase';
import Fireproof from 'fireproof';
import config from './config';
import Q from 'q';

const fb = new Firebase('https://' + config.firebaseApp + '.firebaseio.com');
const fp = new Fireproof(fb);

Fireproof.bless(Q);

export function setupLoginListener(dispatchAuth) {
  return fp.onAuth(dispatchAuth);
}
export function loginWithEmail(email, password) {
  return fp
    .authWithPassword({ email, password })
    .then((data) => {
      // Putting this here to clarify that we don't receive a Firebase Snapshot -- just the object
      return data;
    });
}
export function signupWithEmail(email, password) {
  return fp
    .createUser({ email, password })
    .then((data) => {
      // Putting this here to clarify that we don't receive a Firebase Snapshot -- just the object
      return data;
    });
}
export function getOnce(endpoint) {
  return fp
    .child(endpoint)
    .once('value')
    .then(snapshot => snapshot.val());
}
export function set(endpoint, data) {
  return fp
    .child(endpoint)
    .set(data);
}
export function push(endpoint, data) {
  return fp
    .child(endpoint)
    .set(data);
}
export function remove(endpoint) {
  return fp
    .child(endpoint)
    .remove();
}