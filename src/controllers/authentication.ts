import express from 'express';

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const emptyCredentials = !email || !password;
    if(emptyCredentials) return res.sendStatus(400);
    
    const user = await getUserByEmail(email).select('+auth.salt +auth.password');
    if(!user) return res.sendStatus(400);

    const expectedHash = authentication(user.auth.salt, password);
    if (user.auth.password != expectedHash) return res.sendStatus(403);

    const salt = random();
    user.auth.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('USER-AUTH', user.auth.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (e) {
    console.log(e)
    return res.sendStatus(400);
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try { 
    const {username, email, password} = req.body;
    
    const emptyCredentials = !username || !email || !password;
    if(emptyCredentials) return res.status(400).json({ message: "Warning, credentials missing!"});
    
    const existingUser = await getUserByEmail(email);
    if(existingUser) return res.status(400).json({ message: "Warning, user already registered!"});
  
    const salt = random();
    const user = await createUser({
      email,
      username,
      auth: {
        salt,
        password: authentication(salt, password)
      }
    });

    return res.status(200).json({ message: "User successfully created!", data: user}).end();
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
}