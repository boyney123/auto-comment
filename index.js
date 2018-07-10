module.exports = app => {
  app.on("issues.opened", async context => {
    const config = await context.config(`auto-comment.yml`);
    const { issueOpened } = config || {};

    const params = context.issue({ body: issueOpened });

    // Post a comment on the issue
    return context.github.issues.createComment(params);
  });

  app.on("pull_request.opened", async context => {
    const config = await context.config(`auto-comment.yml`);
    const { pullRequestOpened } = config || {};

    const params = context.issue({ body: pullRequestOpened });

    console.log(params);

    // Post a comment on the issue
    return context.github.issues.createComment(params);
  });
};
