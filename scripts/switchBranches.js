import { inc, major, minor } from 'semver';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const replaceInFile = (file, transform) => {
    const text = readFileSync(file, 'utf8');
    const transformed = transform(text);
    writeFileSync(file, transformed, 'utf-8');
}

const getNextReleaseTag = async () => {
    const releaseResult = await github.rest.repos.getLatestRelease({
        owner: 'gitpod-io',
        repo: 'openvscode-server',
    });
    return inc(releaseResult.data.tag_name.split("-").at(-1), 'minor');
}

const nextTag = process.env.NEXT_TAG || await getNextReleaseTag();
let branchExists = false;

try {
    const branch = `release/${major(nextTag)}.${minor(nextTag)}`;
    await github.rest.repos.getBranch({
        owner: 'microsoft',
        repo: 'vscode',
        branch,
    });
    branchExists = true;
    console.info(`A release for ${branch} branch does exist already. Changing files...`, e);
    replaceInFile('${{ github.workspace }}/openvscode-releases/.github/workflows/insiders-gp.yml', (object) => {
        object = object.replace("'upstream/main'", `'upstream/${branch}'`);
        object = object.replace("'gp-code/main'", `'gp-code/${branch}'`);
        return object;
    });
    replaceInFile('${{ github.workspace }}/openvscode-releases/.github/workflows/insiders.yml', (object) => {
        object = object.replace("'upstream/main'", `'upstream/${branch}'`);
        object = object.replace("'main'", `'${branch}'`);
        return object;
    });
} catch (e) {
    console.info(`A release for ${nextTag} branch does not exist. Reverting to main.`);
    replaceInFile('${{ github.workspace }}/openvscode-releases/.github/workflows/insiders-gp.yml', (object) => {
        object = object.replace(/'upstream\/release\/.{1,5}'/i, "'upstream/main'");
        object = object.replace(/'gp-code\/release\/.{1,5}'/i, "'gp-code/main'");
        return object;
    });
    replaceInFile('${{ github.workspace }}/openvscode-releases/.github/workflows/insiders.yml', (object) => {
        object = object.replace(/'upstream\/release\/.{1,5}'/i, "'upstream/main'");
        object = object.replace(/'release\/.{1,5}'/i, "'main'");
        return object;
    });
}

// Change the values in the gitpod-io/gitpod repository

if (!existsSync('${{ github.workspace }}/gitpod/.github/workflows/')) {
    console.error('Could not find gitpod repo under ${{ github.workspace }}/gitpod. Please clone it in that location.')
    process.exit();
}

if (branchExists) {
    replaceInFile('${{ github.workspace }}/gitpod/.github/workflows/code-nightly.yml', (object) =>
        object.replace(/https:\/\/api.github.com\/repos\/gitpod-io\/openvscode-server\/commits\/gp-code\/release\/.{1,5}/i, 'https://api.github.com/repos/gitpod-io/openvscode-server/commits/gp-code/main'))
} else {
    replaceInFile('${{ github.workspace }}/gitpod/.github/workflows/code-nightly.yml', (object) =>
        object.replace('https://api.github.com/repos/gitpod-io/openvscode-server/commits/gp-code/main', `https://api.github.com/repos/gitpod-io/openvscode-server/commits/gp-code/release/${nextTag}`))
}