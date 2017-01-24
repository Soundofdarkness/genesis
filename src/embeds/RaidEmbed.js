'use strict';

const BaseEmbed = require('./BaseEmbed.js');
const RaidStat = require('../resources/RaidStat.js');

/**
 * Generates simaris embeds
 */
class RaidStatEmbed extends BaseEmbed {
  /**
   * @param {Genesis} bot - An instance of Genesis
   * @param {Simaris} userStats - User raid stat json
   * @param {string} query - Query for this embed
   */
  constructor(bot, userStats, query) {
    super();
    this.title = `Raid statistics for ${query}`;
    this.url = `https://trials.wf/player/?user=${query}`;
    this.color = 0xaf5b4b;
    this.thumbnail = {
      url: 'https://raw.githubusercontent.com/aliasfalse/genesis/master/src/resources/NightmareRaidSekhara.png',
    };
    const stats = {
      lor: new RaidStat(userStats, 'lor'),
      lornm: new RaidStat(userStats, 'lornm'),
      jv: new RaidStat(userStats, 'jv'),
      totals: {},
    };
    stats.total = new RaidStat();
    stats.total.makeTotals(stats.lor, stats.lornm, stats.jv);
    this.fields = [
      {
        name: 'Law of Retribution',
        value: stats.lor.toString(),
        inline: true,
      },
      {
        name: 'Law of Retribution: Nightmare',
        value: stats.lornm.toString(),
        inline: true,
      },
      {
        name: 'Jordas Verdict',
        value: stats.jv.toString(),
        inline: true,
      },
      {
        name: 'Totals',
        value: stats.total.toString(),
        inline: true,
      },
    ];

    this.footer.text = 'Data evaluated by Cephalon Genesis, Warframe Community Developers';
  }
}

module.exports = RaidStatEmbed;