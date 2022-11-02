Endgame: *TBD*
Release: *TBA*

MS release date: `DATE`

DRI: `@` & `@` 
Plan:

- [ ]  Create corresponding release branches for `main` and `gp-code/main`
    - [ ] Create release branch `release/[1.xx]`
    	- Execute the rebase from upstream: `./scripts/sync-with-upstream.sh upstream/release/[1.xx] release/[1.xx]`
    - [ ] Create release branch `gp-code/release/[1.xx]`
     	- Execute the rebase from upstream: `./scripts/sync-with-upstream.sh upstream/release/[1.xx] gp-code/release/[1.xx]`
        - [ ] Turn off all `experimental` feature flags in gitpod-web
          - Ports view
- [ ]  Switch nightly jobs in https://github.com/gitpod-io/openvscode-releases and Gitpod Code-Nightly GitHub actions to point to the release branches
	- [ ] https://github.com/gitpod-io/openvscode-releases/blob/1b60a53a1a34b61dfb41ca13b65bfbad4115bda4/.github/workflows/insiders-gp.yml#L19
    - [ ] https://github.com/gitpod-io/openvscode-releases/blob/1b60a53a1a34b61dfb41ca13b65bfbad4115bda4/.github/workflows/insiders.yml#L19
    - [ ] https://github.com/gitpod-io/gitpod/blob/6c4c22c9133737d5c85948cbd01ed18144735103/.github/workflows/code-nightly.yml#L34
- [ ]  Port fixes from `release/[1.xx]` to `main` if any
- [ ]  Switch nightly jobs in https://github.com/gitpod-io/openvscode-releases and Gitpod Code-Nightly GitHub actions to point back to the `main` and `gp-code/main` branches
- [ ]  Monitor for recovery releases and provide corresponding release in Gitpod and OpenVSCode if necessary

## For each minor / patch release

- [ ]  Create and merge a PR in https://github.com/gitpod-io/gitpod to generate a stable image for VS Code
    - Update `codeCommit` inside of https://github.com/gitpod-io/gitpod/blob/main/WORKSPACE.yaml with the SHA of the tip of the `gp-code/release/{VERSION}` branch
    - Update `codeVersion` inside of https://github.com/gitpod-io/gitpod/blob/main/WORKSPACE.yaml with the version string of the proposed release
    - Use [`insider.md`](https://github.com/gitpod-io/openvscode-releases/blob/main/resources/insider.md) as a PR template
- [ ]  Create and merge PR in https://github.com/gitpod-io/gitpod updating VS Code stable image tags to the image generated in the previous step (the commit can be found in the resulting Werft job) 
	- Update `CodeIDEImageStableVersion` in https://github.com/gitpod-io/gitpod/blob/main/install/installer/pkg/components/workspace/ide/constants.go
	- After updating the file, execute `cd install/installer/; make generateRenderTests`
    - Use [`stable.md`](https://github.com/gitpod-io/openvscode-releases/blob/main/resources/stable.md) as a PR template
- [ ]  Deploy VS Code Insiders as stable ([How to deploy](https://www.notion.so/gitpod/How-to-deploy-IDE-e66a8219add74f2090bfc08104f91445) in Notion)
- [ ]  Release [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)

