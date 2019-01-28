// Requiring probot allows us to initialize an application
const { Application } = require("probot");
// Requiring our app implementation
const plugin = require("../");
// Create a fixtures folder in your test folder
// Then put any larger testing payloads in there
const issueOpenedEvent = require("./events/issue-opened");
const pullRequestOpenedEvent = require("./events/pull-request-opened");

const config = {
  content: Buffer.from(
    `
    issuesOpened: issuesOpened is set
    issuesClosed: issuesClosed is set
    issuesAssigned: issuesAssigned is set
    issuesLabeled: issuesLabeled is set
    issuesUnassigned: issuesUnassigned is set
    issuesUnlabeled: issuesUnlabeled is set
    issuesEdited: issuesEdited is set
    issuesMilestoned: issuesMilestoned is set
    issuesDemilestoned: issuesDemilestoned is set
    issuesReopened: issuesReopened is set

    pullRequestOpened: pullRequestOpened is set
    pullRequestClosed: pullRequestClosed is set
    pullRequestAssigned: pullRequestAssigned is set
    pullRequestLabeled: pullRequestLabeled is set
    pullRequestUnassigned: pullRequestUnassigned is set
    pullRequestUnlabeled: pullRequestUnlabeled is set
    pullRequestEdited: pullRequestEdited is set
    pullRequestReopened: pullRequestReopened is set

    pullRequestReviewRequested: pullRequestReviewRequested is set
    pullRequestReviewRequestRemoved: pullRequestReviewRequestRemoved is set
  `
  ).toString("base64")
};

describe("your-app", () => {
  let app;
  let github;

  beforeEach(() => {
    app = new Application();

    github = {
      repos: {
        getContents: () =>
          Promise.resolve({
            data: config
          })
      },
      issues: {
        createComment: jest.fn()
      }
    };

    app.auth = () => Promise.resolve(github);
    app.load(plugin);
  });

  const createIssueEvent = action => ({
    action,
    issue: {
      number: 19,
      title: "New Issue",
      user: {
        login: "boyney123"
      },
      labels: [],
      state: "open"
    },
    repository: {
      owner: {
        login: "boyney123"
      }
    }
  });

  const createPullRequestEvent = action => ({
    action,
    pull_request: {
      number: 19,
      title: "New Issue",
      user: {
        login: "boyney123"
      },
      labels: [],
      state: "open"
    },
    repository: {
      owner: {
        login: "boyney123"
      }
    }
  });

  [
    ({ config: "issuesOpened", event: "issues.opened", payload: createIssueEvent("opened") },
    { config: "issuesClosed", event: "issues.closed", payload: createIssueEvent("closed") },
    { config: "issuesAssigned", event: "issues.assigned", payload: createIssueEvent("assigned") },
    { config: "issuesUnassigned", event: "issues.unassigned", payload: createIssueEvent("unassigned") },
    { config: "issuesLabeled", event: "issues.labeled", payload: createIssueEvent("labeled") },
    { config: "issuesUnlabeled", event: "issues.unlabeled", payload: createIssueEvent("unlabeled") },
    { config: "issuesEdited", event: "issues.edited", payload: createIssueEvent("edited") },
    { config: "issuesMilestoned", event: "issues.milestoned", payload: createIssueEvent("milestoned") },
    { config: "issuesDemilestoned", event: "issues.demilestoned", payload: createIssueEvent("demilestoned") },
    { config: "issuesReopened", event: "issues.reopened", payload: createIssueEvent("reopened") })
  ].forEach(({ config, event, payload } = {}) => {
    describe(event, () => {
      it(`Reads ${config} from the "auto-comment.yml" and sends the value to github`, async () => {
        await app.receive({ name: "issues", payload });

        expect(github.issues.createComment).toHaveBeenCalledWith({
          body: `${config} is set`,
          number: 19,
          owner: "boyney123",
          repo: undefined
        });
      });

      it(`does not create a new comment if the ${config} cannot be found in the config`, async () => {
        await app.receive({ name: "issues", payload });

        github = {
          repos: {
            getContent: () =>
              Promise.resolve({
                data: {
                  content: Buffer.from(`randomEvent:\n  My Message`).toString("base64")
                }
              })
          },
          issues: {
            createComment: jest.fn()
          }
        };

        expect(github.issues.createComment).not.toHaveBeenCalled();
      });
    });
  });

  [
    { config: "pullRequestOpened", event: "pull_request.opened", payload: createPullRequestEvent("opened") },
    { config: "pullRequestClosed", event: "pull_request.closed", payload: createPullRequestEvent("closed") },
    { config: "pullRequestAssigned", event: "pull_request.assigned", payload: createPullRequestEvent("assigned") },
    { config: "pullRequestUnassigned", event: "pull_request.unassigned", payload: createPullRequestEvent("unassigned") },
    { config: "pullRequestReviewRequested", event: "pull_request.review_requested", payload: createPullRequestEvent("review_requested") },
    { config: "pullRequestReviewRequestRemoved", event: "pull_request.review_request_removed", payload: createPullRequestEvent("review_request_removed") },
    { config: "pullRequestLabeled", event: "pull_request.labeled", payload: createPullRequestEvent("labeled") },
    { config: "pullRequestUnlabeled", event: "pull_request.unlabeled", payload: createPullRequestEvent("unlabeled") },
    { config: "pullRequestEdited", event: "pull_request.edited", payload: createPullRequestEvent("edited") },
    { config: "pullRequestReopened", event: "pull_request.reopened", payload: createPullRequestEvent("reopened") }
  ].forEach(({ config, event, payload } = {}) => {
    describe.only(event, () => {
      it(`Reads ${config} from the "auto-comment.yml" and sends the value to github`, async () => {
        await app.receive({ name: "pull_request", payload });

        expect(github.issues.createComment).toHaveBeenCalledWith({
          body: `${config} is set`,
          number: 19,
          owner: "boyney123",
          repo: undefined
        });
      });

      it(`does not create a new comment if the ${config} cannot be found in the config`, async () => {
        await app.receive({ name: "issues", payload });

        github = {
          repos: {
            getContent: () =>
              Promise.resolve({
                data: {
                  content: Buffer.from(`randomEvent:\n  My Message`).toString("base64")
                }
              })
          },
          issues: {
            createComment: jest.fn()
          }
        };

        expect(github.issues.createComment).not.toHaveBeenCalled();
      });
    });
  });
});
