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
