exports.creds = {
  identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',

  clientID: '3b75af92-6ec7-41d6-9bf8-4986e4d965dd',

  clientSecret: 'D848Q~LNNpXg5Wo_TuFyZXXiXcak2SPo-e6-IbDP',

  responseType: 'code id_token',

  responseMode: 'form_post',

  redirectUrl: 'http://localhost:7000/auth/openid/return',

  allowHttpForRedirectUrl: true,

  validateIssuer: false,

  issuer: null,

  passReqToCallback: false,

  useCookieInsteadOfSession: false,

  cookieEncryptionKeys: [
    { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
    { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
  ],

  scope: ['profile', 'offline_access', 'https://graph.microsoft.com/mail.read'],

  loggingLevel: false,

  nonceLifetime: null,

  nonceMaxAmount: 5,

  clockSkew: null,
}

exports.destroySessionUrl = 'http://localhost:7000'

exports.useMongoDBSessionStore = false

exports.databaseUri = 'mongodb://localhost/OIDCStrategy'

exports.mongoDBSessionMaxAge = 24 * 60 * 60