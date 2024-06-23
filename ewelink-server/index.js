const express = require('express');
const ewelink = require('ewelink-api');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

app.use(express.json()); // Permite o parsing de JSON

// Configurar autenticação básica
app.use(basicAuth({
  authorizer: async (username, password, cb) => {
    const connection = new ewelink({
      email: username,
      password: password,
      region: 'us',
      APP_ID: 'Uw83EKZFxdif7XFXEsrpduz5YyjP7nTl',
      APP_SECRET: 'mXLOjea0woSMvK9gw7Fjsy7YlFO4iSu6'
    });

    try {
      await connection.getCredentials(); // Autentica e obtém o token
      return cb(null, true); // Autenticação bem-sucedida
    } catch (error) {
      return cb(null, false); // Falha na autenticação
    }
  },
  authorizeAsync: true,
  unauthorizedResponse: (req) => 'Unauthorized'
}));

app.post('/toggle/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const email = req.auth.user; // Obtém as credenciais autenticadas
  const password = req.auth.password;

  const connection = new ewelink({
    email: email,
    password: password,
    region: 'us',
    APP_ID: 'Uw83EKZFxdif7XFXEsrpduz5YyjP7nTl',
    APP_SECRET: 'mXLOjea0woSMvK9gw7Fjsy7YlFO4iSu6'
  });

  try {
    await connection.getCredentials(); // Autentica e obtém o token
    const response = await connection.toggleDevice(deviceId); // Alterna o estado do dispositivo
    res.json(response);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor intermediário rodando em http://localhost:${port}`);
});
