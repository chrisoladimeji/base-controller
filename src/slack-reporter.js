// slack-reporter.js
require('dotenv').config();
const { WebClient } = require('@slack/web-api');

class SlackReporter {
  constructor(globalConfig, options) {
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.channel = process.env.SLACK_CHANNEL;
    this.message = process.env.SLACK_MESSAGE;
  }

  async onRunComplete(contexts, results) {
    const passed = results.numPassedTests;
    const failed = results.numFailedTests;
    const status = failed > 0 ? '❌ *FAILED*' : '✅ *PASSED*';
    const text = `${this.message}: ${status}\n• Passed: ${passed}\n• Failed: ${failed}`;
    try {
      await this.slack.chat.postMessage({ channel: this.channel, text });
    } catch (err) {
      // avoid breaking Jest on Slack errors
      console.error('Slack notification error:', err);
    }
  }
}

module.exports = SlackReporter;
