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
    - [ ] https://github.com/gitpod-io/gitpod/blob/4bdee21961c5390e1dc61606b7070af3b0f65971/.github/workflows/code-nightly.yaml#L34
- [ ]  Create and merge PR in Gitpod repo to generate stable image for VS Code https://github.com/gitpod-io/gitpod/pull/9044
    - Use [`insider.md`](insider.md) to create this PR
- [ ]  Create and merge PR in Gitpod repo updating VS Code stable image tags to image generated in previous step 
	- Update in https://github.com/gitpod-io/gitpod/blob/8ca6d2bb27a85688303c4991e0f43b882a14049b/install/installer/pkg/components/workspace/ide/constants.go#L9
	- After updating the file, execute `cd install/installer/; make generateRenderTests`
- [ ]  Deploy VS Code Insiders as stable
- [ ]  Release [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)
- [ ]  Port fixes from `release/[1.xx]` to `main` if any
- [ ]  Switch nightly jobs in https://github.com/gitpod-io/openvscode-releases and Gitpod Code-Nightly GitHub actions to point back to `main` and `gp-code/main` branch
- [ ]  Monitor for recovery releases and provide corresponding release in Gitpod and OpenVSCode if necessary
