import { readFileSync } from 'node:fs';
import JWT from 'jsonwebtoken';

const pemFilePath = "/Users/jamesyoung/gh-pem/template-browser.2022-10-13.private-key.pem"; // TODO make config
const ghAppId = "247562"; // TODO make config

export const createJwt = (): string => {
  const privateKey = readFileSync(pemFilePath, { encoding: 'utf-8' });

  const jwt = JWT.sign({}, privateKey, {
    algorithm: 'RS256',
    issuer: ghAppId,
    expiresIn: '9 minutes',
  });

  console.debug(`Created JWT: ${jwt}`);

  return jwt;
};
