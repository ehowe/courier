exports.requestTemplate = {
  url: '',
  method: 'get',
  name: 'default',
  queries: [],
  headers: [],
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
