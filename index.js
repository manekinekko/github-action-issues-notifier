const github = require("@actions/github");
const core = require("@actions/core");
const nodemailer = require("nodemailer");

// This event will only trigger a workflow run if the workflow file is on the default branch.
(async function () {
  try {
    const issue = getIssue();
    const issueLabels = getIssueLabels();
    const issueAssignees = getIssueAssignees();

    if (!issue) {
      console.log("Could not get issue from context. Exiting!");
      return;
    }

    if (issueAssignees.length === 0) {
      console.log(`Could not find assignees for issue #${number}. Exiting!`);
      return;
    }

    const labels = core.getInput("labels", { required: true });
    const labelFound = labels.split(",").some((label) => issueLabels.includes(label));
    if (labelFound) {
      const info = await sendEmail(
        `GitHub Issues Notifier`,
        `A critical issue was created!</br>` + `</br>Read more: <a href='${issue.html_url}'>${issue.html_url}</a></br>`
      );

      console.log(`Email sent successfully!`);
    } else {
      console.log(`Issue not containing one of the required labels "${labels}". Exiting!`);
    }
  } catch (error) {
    console.log(error);
  }
})();

function getIssue() {
  const issue = github.context.payload.issue;
  return issue || null;
}

function getIssueLabels() {
  const issue = getIssue();
  if (issue) {
    return (issue.labels || []).map((label) => label.name);
  }
}

function getIssueNumber() {
  const issue = getIssue();
  if (issue) {
    return issue.number;
  }
}

function getIssueAssignees() {
  const issue = getIssue();
  if (issue) {
    return issue.assignees;
  }
}

async function sendEmail(subject, body) {
  const smtpHost = core.getInput("smtpHost", { required: true });
  const smtpPort = core.getInput("smtpPort", { required: true });
  const username = core.getInput("username", { required: true });
  const password = core.getInput("password", { required: true });
  const to = core.getInput("to", { required: true });
  const from = core.getInput("from", { required: true });
  const bcc = core.getInput("bcc", { required: false });

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort == "465",
    auth: {
      user: username,
      pass: password,
    },
  });

  const message = {
    to,
    from,
    bcc,
    subject,
    html: body,
  };

  return await transport.sendMail(message);
}
