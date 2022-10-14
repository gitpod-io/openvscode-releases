## Description
Updates the stable image of VS Code Browser to `1.xy.z` (https://github.com/microsoft/vscode/releases/tag/1.xy.z)

## Related Issue(s)
A part of LINK_TO_RELEASE_ISSUE

## How to test
Open the preview environment, select VS Code Browser (non-`latest`) and in the <kbd>About</kbd> dialog check that we are on `1.xy.z`.

## Release Notes
```release-note
NONE
```

## Werft options:

- [ ] /werft with-local-preview
      If enabled this will build `install/preview`
- [x] /werft with-preview
- [ ] /werft with-integration-tests=all
      Valid options are `all`, `workspace`, `webapp`, `ide`
