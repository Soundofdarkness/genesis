'use strict';

const Command = require('../Command.js');

/**
 * Calculates the damage reduction for a given armor value
 * @param {number} currentArmor The enemy's armor
 * @returns {number}
 */
function damageReduction(currentArmor) {
  return currentArmor / (currentArmor + 300);
}

/**
 * Calculates the number of corrosive procs that would be needed to completely
 * strip armor from an enemy
 * @param {number} armor The enemy's armor
 * @returns {number}
 */
function armorStrip(armor) {
  return Math.ceil(8 * Math.log10(armor));
}

/**
 * Calculates an enemy armor at a given level
 * @param {number} baseArmor    The enemy's armor at the base level
 * @param {number} baseLevel    The enemy's base level
 * @param {number} currentLevel The level to calculate armor at
 * @returns {number}
 */
function armorAtLevel(baseArmor, baseLevel, currentLevel) {
  return baseArmor * (1 + (((currentLevel - baseLevel) ** 1.75) / 200));
}


/**
 * Performs armor calculations
 */
class Armor extends Command {
  /**
   * Constructs a callable command
   * @param {Genesis} bot  The bot object
   */
  constructor(bot) {
    super(bot, 'misc.armor', 'armor', 'armor');

    this.regex = new RegExp('^armor(?:\\s+([\\d+\\.?\\d*\\s]+))?', 'i');

    this.usages = [
      { description: 'Display instructions for calculating armor', parameters: [] },
      {
        description: 'Display current damage resistance and amount of corrosive procs ' +
          'required to strip it.',
        parameters: ['current armor'],
      },
      {
        description: 'Display the current armor, damage resistance, and necessary ' +
          'corrosive procs to strip armor.',
        parameters: ['base armor', 'base level', 'current level'],
      },
    ];
  }

  /**
   * Run the command
   * @param {Message} message Message with a command to handle, reply to,
   *                          or perform an action based on parameters.
   */
  run(message) {
    const pattern3Params = /(\d+\.?\d*)(?:\s+(\d+\.?\d*)\s+(\d+\.?\d*))?/;
    const params3 = message.content.match(pattern3Params);
    let armorString = '';
    if (params3 && params3.length > 3) {
      const armor = params3[1];
      const baseLevel = params3[2];
      const currentLevel = params3[3];
      if (typeof baseLevel === 'undefined') {
        this.logger.debug('Entered 1-param armor');
        armorString = this.armorSimple(parseInt(armor, 10));
      } else {
        this.logger.debug('Entered 3-param armor');
        armorString = this.armorFull(parseFloat(armor), parseFloat(baseLevel),
          parseFloat(currentLevel));
      }

      const embed = {
        color: 0xffa500,
        author: {
          name: this.bot.client.user.clientID,
          icon_url: this.bot.client.user.avatarURL,
        },
        title: 'Warframe - Armor',
        url: 'https://warframe.com',
        thumbnail: {
          url: 'https://raw.githubusercontent.com/aliasfalse/genesis/master/src/resources/grineer.png',
        },
        fields: [
          {
            name: 'Armor Calculation:',
            value: armorString,
          },
        ],
        footer: {
          icon_url: 'https://avatars1.githubusercontent.com/u/24436369',
          text: 'Data evaluated by Warframe Community Developers',
        },
      };
      message.channel.sendEmbed(embed)
        .then(() => {
          if (message.deletable) {
            return message.delete(2000);
          }
          return Promise.resolve();
        }).catch(this.logger.error);
    } else {
      this.logger.debug('Entered 0-param armor');
      this.sendUsage(message);
    }
  }

  /**
   * Replies with details on the command's usage
   * @param {Message} message The message to reply to
   */
  sendUsage(message) {
    const embed = {
      color: 0xff0000,
      author: {
        name: this.bot.client.user.clientID,
        icon_url: this.bot.client.user.avatarURL,
      },
      title: 'Warframe - Armor',
      url: 'https://warframe.com',
      thumbnail: {
        url: 'https://raw.githubusercontent.com/aliasfalse/genesis/master/src/resources/grineer.png',
      },
      fields: [
        {
          name: 'Possible uses include:',
          value: `${this.bot.prefix}armor (Base Armor) (Base Level) (Current Level) calculate armor and stats.${this.md.lineEnd}` +
          `${this.bot.prefix}armor (Current Armor) Calculate damage resistance.`,
        },
      ],
      footer: {
        icon_url: 'https://avatars1.githubusercontent.com/u/24436369',
        text: 'Data evaluated by Warframe Community Developers',
      },
    };

    message.reply('', { embed })
    .then(() => {
      if (message.deletable) {
        return message.delete(2000);
      }
      return Promise.resolve();
    }).catch(this.logger.error);
  }

  /**
   * Returns a string with details on an enemy's armor at a certain level
   * @param {number} baseArmor    The enemy's armor at the base level
   * @param {number} baseLevel    The enemy's base level
   * @param {number} currentLevel The level to calculate armor at
   * @returns {string}
   */
  armorFull(baseArmor, baseLevel, currentLevel) {
    const armor = armorAtLevel(baseArmor, baseLevel, currentLevel);
    return [
      `At level ${Math.round(currentLevel)} your enemy would have ${armor.toFixed(2)} Armor`,
      `${(damageReduction(armor) * 100).toFixed((2))}% damage reduction`,
      `You will need ${armorStrip(armor)} corrosive procs to strip your enemy of armor.`,
    ].join(this.md.lineEnd);
  }

  /**
   * Returns a string with details on an enemy's armor
   * @param {number} armor    The enemy's armor
   * @returns {string}
   */
  armorSimple(armor) {
    return this.md.codeMulti +
      [
        `${(damageReduction(armor) * 100).toFixed(2)}% damage reduction`,
        `You will need ${armorStrip(armor)} corrosive procs to strip your enemy of armor.`,
      ].join(this.md.lineEnd) +
      this.md.blockEnd;
  }
}

module.exports = Armor;
