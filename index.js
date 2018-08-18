'use strict';

const program = require('commander');
const rp = require('request-promise');
const { forEach } = require('p-iteration')

const GITHUB_BASE_URL = 'https://api.github.com';
const PAGE_SIZE = 30;

program
  .description('Finds all the repos in an organization you have contributed to')
  .option('--org-name <s>')
  .option('--username <s>')
  .parse(process.argv);

function checkTokenExported() {
  if (!process.env.GithubToken) {
    throw new Error('Please export the github token');
  }
  return;
}

const reqOrgRepos = async (orgName, page) => {
  const options = {
      uri: `${GITHUB_BASE_URL}/orgs/${orgName}/repos`,
      qs: {
          access_token: process.env.GithubToken,
          type: 'public',
          page: page
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true
  };

  let response = await rp(options);
  return response;
}

const reqRepoContributors = async (orgName, repoName) => {
  const options = {
      uri: `${GITHUB_BASE_URL}/repos/${orgName}/${repoName}/contributors`,
      qs: {
          access_token: process.env.GithubToken,
          type: 'public'
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true
  };

  let response = await rp(options);
  return response;
}

const findRepos = async (orgName) => {
  let repos = [];
  let keepGoing = true;
  let page = 1;

  while (keepGoing) {
    let response = '';
      try {
        response = await reqOrgRepos(orgName, page);
        await repos.push.apply(repos, response);        
      } catch(err) {
        console.log(err);
      }
      page += 1;

      if (response.length < PAGE_SIZE) {
        keepGoing = false;
      }
  }

  return repos;
}

const findUserContributedRepos = async (repos, username, orgName) => {
  let userRepos = [];
  let contributorsLists = [];

  await forEach(repos, async (repo) => {
    const list = await reqRepoContributors(orgName, repo.name);
    contributorsLists.push(list);
    console.log(contributorsLists.length);
  });

  for (let [index, contributors] of contributorsLists.entries()) {
    const isUserContributor = contributors.filter((contributor) => contributor.login === username).length > 0;
    console.log(isUserContributor);
    if (isUserContributor) {
      userRepos.push(repos[index].name);
    }
  }
  return userRepos;
}

const findUserRepos = async(orgName, username) => {
  checkTokenExported();
  const repos = await findRepos(orgName);
  const userRepos = await findUserContributedRepos(repos, username, orgName);
  console.log(userRepos);
}

if (!program.orgName || !program.username) {
  program.outputHelp();
} else {
  findUserRepos(program.orgName, program.username);
}
