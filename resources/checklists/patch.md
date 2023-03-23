# VS Code patch release checklist

- Create and merge a PR in https://github.com/gitpod-io/gitpod to switch Insiders and (use https://github.com/gitpod-io/openvscode-releases/blob/main/resources/release-pr.md)
    - Update `codeCommit` inside of https://github.com/gitpod-io/gitpod/blob/main/WORKSPACE.yaml with the SHA of the tip of the `gp-code/release/{VERSION}` branch
    - Update `codeVersion` inside of https://github.com/gitpod-io/gitpod/blob/main/WORKSPACE.yaml with the version string of the proposed release
    - Use [`release-pr.md`](https://github.com/gitpod-io/openvscode-releases/blob/main/resources/release-pr.md) as the PR template
    - Update the VS Code stable image tags to the image generated in the previous step (the commit can be found in the resulting Werft job) 
	    - Update `CodeIDEImageStableVersion` in https://github.com/gitpod-io/gitpod/blob/main/install/installer/pkg/components/workspace/ide/constants.go
- Deploy VS Code Insiders as stable ([How to deploy](https://www.notion.so/gitpod/How-to-deploy-IDE-e66a8219add74f2090bfc08104f91445) in Notion)
- Release [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)
