const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('licensecount')
        .setDescription('Get the count of active, suspended, and expired licenses'),

    async execute(interaction, db) {
        db.all(`SELECT status, COUNT(*) AS count FROM licenses GROUP BY status`, (err, rows) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Failed to retrieve license count.');
            }

            const counts = rows.map(row => `**${row.status}**: ${row.count}`).join('\n');
            interaction.reply(`📊 **License Counts:**\n${counts}`);
        });
    }
};