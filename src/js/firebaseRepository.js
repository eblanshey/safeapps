import Firebase from 'firebase';
import Fireproof from 'fireproof';
import config from './config';
import Q from 'q';

const fb = new Firebase('https://' + config.firebaseApp + '.firebaseio.com');
const fp = new Fireproof(fb);

Fireproof.bless(Q);

export function loginWithEmail(email, password) {
  return fp
    .authWithPassword({ email, password })
    .then((data) => data.val());
}
export function signupWithEmail(email, password) {
  return fp
    .createUser({ email, password })
    .then((data) => data.val());
}