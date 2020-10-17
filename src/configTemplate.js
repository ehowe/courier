exports.responseTemplate = {
  code: 0,
  body: { Response: '' },
  headers: [],
}

exports.requestTemplate = {
  body: { Ace: '{}', FormUrlEncoded: [] },
  bodyType: 'json',
  headers: [],
  method: 'get',
  name: 'default',
  queries: [],
  url: '',
  response: exports.responseTemplate,
}

exports.workspaceTemplate = {
  defaultRequest: 'default',
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
  }
}
