'use strict';

const Command = require('../Command.js');
const SettingsEmbed = require('../embeds/SettingsEmbed.js');

class Settings extends Command {
  constructor(bot) {
    super(bot, 'settings.settings', 'settings', 'Get settings');
    this.regex = new RegExp(`^${this.call}$`, 'i');
  }

  run(message) {
    const settings = [];
    this.bot.settings.getChannelLanguage(message.channel)
    .then((language) => {
      settings.push({ name: 'Language', value: language });
      return this.bot.settings.getChannelPlatform(message.channel);
    })
    .then((platform) => {
      settings.push({ name: 'Platform', value: platform });
      return this.bot.settings.getChannelResponseToSettings(message.channel);
    })
    .then((respond) => {
      settings.push({ name: 'Respond to Settings', value: respond ? 'yes' : 'no' });
      return this.bot.settings.getChannelPrefix(message.channel);
    })
    .then((prefix) => {
      settings.push({ name: 'Command Prefix', value: prefix });
      const embed = new SettingsEmbed(this.bot, message.channel, settings);
      message.channel.sendEmbed(embed).then((settingsMsg) => {
        if (settingsMsg.deletable) {
          settingsMsg.delete(50000).catch(this.logger.error);
        }
      });
    })
    .catch(this.logger.error);

    if (message.deletable) {
      message.delete(5000).catch(this.logger.error);
    }
  }
}

module.exports = Settings;
