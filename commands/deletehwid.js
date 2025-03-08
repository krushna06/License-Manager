const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletehwid')
        .setDescription('Remove the HWID associated with a license')
        .addStringOption(option => 
            option.setName('license_id')
            .setDescription('License ID to remove HWID from')
            .setRequired(true)
        ),

    async execute(interaction, db) {
        const licenseId = interaction.options.getString('license_id');

        db.run(`UPDATE licenses SET hwid = NULL WHERE id = ?`, [licenseId], (err) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Failed to delete HWID.');
            }
            interaction.reply(`HWID for license ID \`${licenseId}\` has been removed.`);
        });
    }
};