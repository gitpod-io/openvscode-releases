# VS Code patch release checklist

- Trigger GHA https://github.com/gitpod-io/gitpod/actions/workflows/code-build.yaml with target version like `gp-code/release/1.89`
- Test and approve generated PR (1) from step 1
- There will be another follow up PR (1) created after PR (1) is merged into main and built, test and approve again
- Release [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)
