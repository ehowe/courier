exports.responseTemplate = {
  code: 0,
  body: { Response: '' },
  headers: [],
}

exports.authTemplate = {
  Basic: { username: '', password: '' },
  Bearer: { token: '', prefix: 'Bearer' },
}

exports.requestTemplate = {
  activeAuthProvider: 'None',
  auth: exports.authTemplate,
  body: { Ace: '{}', FormUrlEncoded: [] },
  bodyType: 'json',
  headers: [],
  method: 'get',
  name: 'default',
  queries: [],
  response: exports.responseTemplate,
  url: '',
}

exports.environmentTemplate = {
  configuration: [],
  name: 'base',
  private: false,
}

exports.workspaceTemplate = {
  defaultEnvironment: 'base',
  defaultRequest: 'default',
  environments: [exports.environmentTemplate],
  name: 'default',
  requests: [
    exports.requestTemplate,
  ],
}

exports.configTemplate = {
  defaultWorkspace: 'default',
  workspaces: [
    exports.workspaceTemplate,
  ],
}

exports.appConfigTemplate = {
  defaultConfigProvider: 'Local',
  gitConfig: {
    repository: null,
    ref: null,
    path: null,
    name: null,
    email: null,
    token: null,
  },
}
