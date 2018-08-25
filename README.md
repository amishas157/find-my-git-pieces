# find-my-git-pieces

A tool to help you find all the repos where you contributed in an github organisation

## Usage

#### Installation
1. `git clone https://github.com/amishas157/find-my-git-pieces.git`
2. `npm install`

#### CLI
`node index.js --org-name organisationName --username username`

To get contributions in public or private repositories exclusively, you can pass `--public` or `--private` respectively. By default, it is set to `all` which fetches contributions to both private and public repositories.

#### Exporting the environment Variable

You would need to export an Environment variable `GithubToken` which is basically a personal access token and has full `repo` scope.
`export GithubToken=123xxxxxxx`

##### Output

The output will be printed on console as an array of repo names
