# VS Code minor release checklist

-  Create corresponding release branches for `main` and `gp-code/main`
    - Create a release branch `release/[1.xx]` based on `main`
    	- Execute the rebase from upstream: `./scripts/sync-with-upstream.sh upstream/release/[1.xx] release/[1.xx]`
    - Create release branch `gp-code/release/[1.xx]` based on `gp-code/main`
     	- Execute the rebase from upstream: `./scripts/sync-with-upstream.sh upstream/release/[1.xx] gp-code/release/[1.xx]`
-  Switch nightly jobs in https://github.com/gitpod-io/openvscode-releases and Gitpod Code-Nightly GitHub actions to point to the release branches
	- https://github.com/gitpod-io/openvscode-releases/blob/1b60a53a1a34b61dfb41ca13b65bfbad4115bda4/.github/workflows/insiders-gp.yml#L19
    - https://github.com/gitpod-io/openvscode-releases/blob/1b60a53a1a34b61dfb41ca13b65bfbad4115bda4/.github/workflows/insiders.yml#L19
    - https://github.com/gitpod-io/gitpod/blob/23eb2d62927f016595064203051590e0f220f5db/.github/workflows/code-nightly.yml#L34
-  Port fixes from `release/[1.xx]` to `main` if any
-  Switch nightly jobs in https://github.com/gitpod-io/openvscode-releases and Gitpod Code-Nightly GitHub actions to point back to the `main` and `gp-code/main` branches
-  Monitor for recovery releases and provide corresponding release in Gitpod and OpenVSCode if necessary
