<p align="center">
  <img src="https://avatars3.githubusercontent.com/in/14394?s=88&amp;v=4" width="64">
  <h3 align="center"><a href="https://boyney123.github.io/auto-comment/">auto-comment</a></h3>
  <p align="center">A GitHub App built with <a href="https://github.com/probot/probot">Probot</a> that comments on new issues and pull requests based on your configuration.<p>
 
  </p>
</p>

![todo](./example.png)


## Usage

Using **auto-comment** is simple. Once you've installed it in your repository you will need to setup your `./github/auto-comment.yml` file and **auto-comment** will do the rest.

## Configuring for your project

There are a couple of configuration options that you will need to setup depending on what you want.

```yml
# Comment to a new issue.
issueOpened: >
  Thank your for raising a issue. We will try and get back to you as soon as possible. 
  
  Please make sure you have given us as much context as possible.

```

### Available options

| Name | Type | Description | Example of Usage |
|------|------|-------------|------------------|
| issueOpened | `string` | This will be the message when new issues are created. | Auto comments on new issues are a great way to give feedback to users or a way of telling users to make sure they provide as much context as possible. |




