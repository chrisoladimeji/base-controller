// In slack-reporter.js
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

class SlackReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
    this.token = process.env.SLACK_BOT_TOKEN;
    this.channel = process.env.SLACK_CHANNEL;
    this.web = this.token ? new WebClient(this.token) : null;
  }

  async onRunComplete(contexts, results) {
    if (!this.web || !this.channel) {
      console.log('Slack Reporter: SLACK_BOT_TOKEN or SLACK_CHANNEL not set in .env file. Skipping notification.');
      return;
    }

    const { numFailedTests, numPassedTests } = results;
    const hasFailures = numFailedTests > 0;
    const status = hasFailures ? 'FAILED' : 'PASSED';
    const color = hasFailures ? '#a30200' : '#2eb886';
    const message = `*DigiCred-Holdings-Base-Controller Unit tested: ${status}*`;

    try {
      await this.web.chat.postMessage({
        channel: this.channel,
        text: `${message}\n• Passed: ${numPassedTests}\n• Failed: ${numFailedTests}`,
        attachments: [
          {
            color: color,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: message,
                },
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Passed:*\n${numPassedTests}` },
                  { type: 'mrkdwn', text: `*Failed:*\n${numFailedTests}` },
                ],
              },
            ],
          },
        ],
      });
      console.log('Slack notification sent successfully.');
    } catch (error) {
      console.error('Error sending Slack notification:', error.message);
    }
  }
}

module.exports = SlackReporter;