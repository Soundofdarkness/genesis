'use strict';

const Command = require('../Command.js');

class Platform extends Command {
  constructor(bot) {
    super(bot, 'settings.platform', 'platform');
    this.usages = [
      { description: 'Change this channel\'s platform', parameters: ['platform'] },
    ];
    this.regex = new RegExp(`^${this.bot.escapedPrefix}${this.call}(?:\\s+([pcsxb14]{2,3}))?`,
      'i');
  }

  run(message) {
    const platform = message.cleanContent.match(this.regex)[1];
    if (!platform || !this.bot.platforms.includes(platform.toLowerCase())) {
      message.channel.sendEmbed({
        title: 'Usage',
        type: 'rich',
        color: 0x0000ff,
        fields: [
          {
            name: `${this.bot.prefix}${this.call} <platform>`,
            value: `Platform is one of ${this.bot.platforms.join(', ')}`,
          },
        ],
      });
    } else {
      this.bot.settings.setChannelPlatform(message.channel, platform.toLowerCase()).then(() =>
        message.react('\u2705')
      ).then(() => {
        message.reply('Settings updated');
      }).catch(this.logger.error);
    }
  }
}

module.exports = Platform;