const eventTypes = {
  issue: [
    "assigned",
    "unassigned",
    "labeled",
    "unlabeled",
    "opened",
    "edited",
    "milestoned",
    "demilestoned",
    "closed",
    "reopened"
  ],
  pull_request: [
    "assigned",
    "unassigned",
    "review_requested",
    "review_request_removed",
    "labeled",
    "unlabeled",
    "opened",
    "edited",
    "closed",
    "reopened"
  ]
};

function toCamelCase(input) {
  return input.toLowerCase().replace(/[\.|_](.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

module.exports = app => {
  const scopes = Object.keys(eventTypes);
  scopes.map(scope => {
    const events = eventTypes[scope];
    events.map(event => {
      const eventName = `${scope}.${event}`;
      app.on(eventName, async context => {
        const config = await context.config(`auto-comment.yml`);
        const templateKey = toCamelCase(eventName);
        const templateData = config[templateKey];
        if (templateData) {
          const params = context.issue({ body: templateData });

          // Post a comment on the issue
          return context.github.issues.createComment(params);
        }

        return false;
      });
    });
  });
};
