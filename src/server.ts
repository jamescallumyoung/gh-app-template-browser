import express from 'express';
import {createJwt} from "./jwt/create-jwt.js";
import {
  getInstallationAccessToken,
  getInstallationRepos, getInstallations,
} from "./api/gh/gh-api-client.js";

const app = express();

// root
app.get('/', async (req, res) => {
  res.send({ msg: 'Hello, World!' });
});

// admin utils

app.get('/jwt', async (req, res) => {
  res.send({ jwt: createJwt() });
});

app.get('/installations', async (req, res) => {
  res.send({
    installations: (await getInstallations(createJwt())).map(installation => ({ [installation.account.login]: installation.id })),
  });
});

app.get('/installations/:installationId/access-token', async (req, res) => {
  const installationId = (req.params as Record<string, string>)?.['installationId'];
  if (!installationId) return "err"; // TODO real error

  try {
    const installationAccessToken = await getInstallationAccessToken(createJwt(), installationId);
    res.send({ installationAccessToken });
  }
  catch (err) {
    res.status(500).send(err);
  }
});

// installation
// , repos

app.get('/installations/:installationId/repos', async (req, res) => {
  const installationId = (req.params as Record<string, string>)?.['installationId'];
  if (!installationId) return "err"; // TODO real error

  const templatesOnly = (req.query as Record<string, string>)?.['filter'] === 'templates';

  try {
    const { token: installationAccessToken } = await getInstallationAccessToken(createJwt(), installationId);
    const repos = await getInstallationRepos(installationAccessToken);

    if (templatesOnly) {
      res.send({ repos: repos.repositories.filter(repo => repo.is_template) });
    }
    else {
      res.send({ repos: repos.repositories });
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

// start the server
app.listen(3000)
