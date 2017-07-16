import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { auth as config } from '../config';
import { database } from '../schema/models';

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: '/login/facebook/callback',
  profileFields: ['name', 'email', 'link', 'gender', 'locale', 'timezone'],
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (req.user) {
      const userLogin = await database.User.findOne({ 'account.facebook.id': profile.id });
      if (userLogin) {
        // There is already a Facebook account that belongs to you.
        // Sign in with that account or delete it, then link it with your current account.
        done(null, req.user);
      } else {
        // User already signin with some method that isn't facebook.
        // Attemp to link facebook access code to that aaccount.
        const user = await database.User.findOne({ _id: req.user.id });
        done(null, user);
      }
    } else {
      const existUser = await database.User.findOne({ 'account.facebook.id': profile.id });
      if (existUser) {
        done(null, existUser);
      } else {
        let user = await database.User.findOne({ 'account.email': profile._json.email });
        if (user) {
          // There is already an account using this email address. Sign in to
          // that account and link it with Facebook manually from Account Settings.
          done(null);
        } else {
          user = await database.User.insert({
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            account: {
              email: profile._json.email,
              facebook: {
                id: profile.id,
                accessCode: accessToken,
              },
            },
            avatar: `https://graph.facebook.com/${profile.id}/picture?type=large`,
          });
          done(null, user);
        }
      }
    }
  } catch (err) {
    done(err);
  }
}));

export default passport;
