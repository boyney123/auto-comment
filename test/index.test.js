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
    issueOpened: My Message

    pullRequestOpened: My Message  
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

  describe("issues.opened", () => {
    it("Reads `issuedOpened` from the `auto-comment.yml` and sends the value to github", async () => {
      await app.receive({ name: "issues", payload: issueOpenedEvent });

      expect(github.issues.createComment).toHaveBeenCalledWith({
        body: "My Message",
        number: 19,
        owner: "boyney123",
        repo: undefined
      });
    });

    it("does not create a new comment if the `issuedOpened` cannot be found in the config", async () => {
      await app.receive({ name: "issues", payload: issueOpenedEvent });

      github = {
        repos: {
          getContent: () =>
            Promise.resolve({
              data: {
                content: Buffer.from(
                  `pullRequestOpened:\n  My Message`
                ).toString("base64")
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

  describe("pullRequests.opened", () => {
    it("Reads `pullRequestOpened` from the `auto-comment.yml` and sends the value to github", async () => {
      await app.receive({
        name: "pull_request",
        payload: pullRequestOpenedEvent
      });

      expect(github.issues.createComment).toHaveBeenCalledWith({
        body: "My Message",
        number: 19,
        owner: "boyney123",
        repo: undefined
      });
    });

    it("does not create a new comment if the `pullRequestOpened` cannot be found in the config", async () => {
      await app.receive({
        name: "pull_request",
        payload: pullRequestOpenedEvent
      });

      github = {
        repos: {
          getContent: () =>
            Promise.resolve({
              data: {
                content: Buffer.from(`issueOpened:\n  My Message`).toString(
                  "base64"
                )
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
