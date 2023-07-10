## Description
Update code to `1.x.x`

## Progress

- [ ] Update Insiders  (https://github.com/gitpod-io/gitpod/blob/main/WORKSPACE.yaml)
- [ ] Update Stable (https://github.com/gitpod-io/gitpod/blob/main/install/installer/pkg/components/workspace/ide/constants.go)

## How to test

- Switch to VS Code Browser Insiders in settings.
- Start a workspace.
- Test the following:
  - [ ] terminals are preserved and resized properly between window reloads
  - [ ] WebViews are working
  - [ ] extension host process: check language smartness and debugging 
  - [ ] extension management (installing/uninstalling)
  - [ ] install the [VIM extension](https://open-vsx.org/extension/vscodevim/vim) to test web extensions
  - that user data is synced across workspaces as well as on workspace restarts, especially for extensions
     - [ ] extensions from `.gitpod.yml` are not installed as sync
     - [ ] extensions installed as sync are actually synced to all new workspaces
  - [ ] settings should not contain any mentions of MS telemetry
  - [ ] WebSockets and workers are properly proxied
     - [ ] diff editor should be operable
     - [ ] trigger reconnection with `window.WebSocket.disconnectWorkspace()`, check that old WebSockets are closed and new opened of the same amount
  - [ ] workspace specific commands should work, i.e. <kbd>F1</kbd> → type <kbd>Gitpod</kbd>
  - [ ] that a PR view is preloaded when opening a PR URL
  - [ ] test `gp open` and `gp preview`
  - [ ] test open in VS Code Desktop, check `gp open` and `gp preview` in task/user terminals
  - [ ] telemetry data like `vscode_extension_gallery` is collected in [Segment](https://app.segment.com/gitpod/sources/staging_trusted/debugger)

### Preview status
gitpod:summary

## Werft options:

- [x] /werft with-preview
- [x] /werft analytics=segment
