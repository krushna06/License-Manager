const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suspendlicense')
        .setDescription('Suspend a license by ID')
        .addIntegerOption(option => option.setName('license_id').setDescription('License ID to suspend').setRequired(true)),

    async execute(interaction, db) {
        const licenseId = interaction.options.getInteger('license_id');

        db.run(`UPDATE licenses SET status = 'suspended' WHERE id = ?`, [licenseId], (err) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Failed to suspend license.');
            }
            interaction.reply(`License with ID ${licenseId} has been suspended.`);
        });
    }
};
