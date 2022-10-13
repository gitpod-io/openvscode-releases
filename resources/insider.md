## Description
Update code to `1.x.x`

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
     - [ ] diff editor should be operatable
     - [ ] trigger reconnection with `window.WebSocket.disconnectWorkspace()`, check that old WebSockets are closed and new opened of the same amount
  - [ ] workspace specific commands should work, i.e. F1 → type <kbd>Gitpod</kbd> prefix
  - [ ] that a PR view is preloaded when opening a PR URL
  - [ ] test `gp open` and `gp preview`
  - [ ] test open in VS Code Desktop, check `gp open` and `gp preview` in task/user terminals
  - [ ] telemetry data is collected in [Segment](https://app.segment.com/gitpod/sources/staging_untrusted/debugger)

## Release Notes
<!--
  Add entries for the CHANGELOG.md or "NONE" if there aren't any user facing changes.
  Each line becomes a separate entry.
  Format: [!<optional for breaking>] <description>
  Example: !basic auth is no longer supported
  See https://www.notion.so/gitpod/Release-Notes-513a74fdd23b4cb1b3b3aefb1d34a3e0
-->
```release-note
NONE
```

## Werft options:

- [x] /werft with-preview
- [x] /werft analytics=segment|TEZnsG4QbLSxLfHfNieLYGF4cDwyFWoe
