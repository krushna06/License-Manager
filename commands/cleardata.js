const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleardata')
        .setDescription('Clear all expired or inactive licenses.'),

    async execute(interaction, db) {
        db.run(`DELETE FROM licenses WHERE status = 'expired' OR status = 'inactive' OR status = 'suspended'`, (err) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Failed to clear data.');
            }
            interaction.reply('🧹 All expired or inactive licenses have been cleared.');
        });
    }
};