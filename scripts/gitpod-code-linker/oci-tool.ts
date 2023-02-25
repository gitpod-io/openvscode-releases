import cp from 'child_process';

const exec = async (command, options) => {
    if (!options?.quiet) {
        console.log(`Running: ${command}`);
    }
    return new Promise((resolve, reject) => {
        const child = cp.exec(command, {
            cwd: options?.cwd,
            maxBuffer: 10 * 1024 * 1024, // 10MB
            env: {
                ...process.env,
                // remove on purpose to work around issues in vscode package
                GITHUB_TOKEN: options?.ghtoken ? process.env.GITHUB_TOKEN : undefined,
            },
            shell: "/bin/bash"
        }, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            resolve({ stdout, stderr });
        });
        if (!options?.quiet) {
            child.stdout.pipe(process.stdout);
        }
        child.stderr.pipe(process.stderr);
    });
};

export const getInfoFromImage = async (imageCommit: string) => {
    const imageName = `eu.gcr.io/gitpod-core-dev/build/ide/code:commit-${imageCommit}`;
    const out: any = await exec(`oci-tool fetch image ${imageName}`, {});
    const info = JSON.parse(out.stdout).config.Labels;
    const version = info['io.gitpod.ide.version'];
    const commit = info['io.gitpod.ide.commit'];

    return { version, commit };
};