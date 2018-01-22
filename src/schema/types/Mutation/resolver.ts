import * as jwt from 'jsonwebtoken';
import { auth, uploadDir } from '../../../config';
import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  Mutation: {
    async login(
      _,
      { email, password },
      { database, res },
    ) {
      const emailC = email.toLowerCase();
      const user = await database.User.findOne({ 'account.email': emailC });
      if (user && user.comparePassword(password)) {
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign({
          _id: user._id,
        }, auth.jwt.secret, { expiresIn });
        (res as any).cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });

        return user;
      } else {
        throw new Error('Incorrect login');
      }
    },

    async register(
      _,
      { input },
      { database, res },
    ) {
      const { firstName, middleName, lastName, avatar, telNumber, email, password, ...props } = input;
      const user = await database.User.insert({
        ...props,
        avatar: avatar || '/avatar.jpg',
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        tel_number: telNumber,
        account: {
          email,
          password,
        },
      });

      const expiresIn = 60 * 60 * 24 * 180; // 180 days
      const token = jwt.sign({
        _id: user._id,
      }, auth.jwt.secret, { expiresIn });
      (res as any).cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });

      return user;
    },
  },
};

export default resolver;
