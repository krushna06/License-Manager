const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suspendlicense')
        .setDescription('Suspend a license by ID')
        .addStringOption(option => 
            option.setName('license_id')
            .setDescription('License ID to suspend')
            .setRequired(true)
        ),

    async execute(interaction, db) {
        const licenseId = interaction.options.getString('license_id');

        db.get(`SELECT * FROM licenses WHERE id = ?`, [licenseId], (err, row) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Error checking license existence.');
            }

            if (!row) {
                return interaction.reply(`No license found with ID \`${licenseId}\`.`);
            }

            if (row.status === 'suspended') {
                return interaction.reply(`License \`${licenseId}\` is already suspended.`);
            }

            db.run(`UPDATE licenses SET status = 'suspended' WHERE id = ?`, [licenseId], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr.message);
                    return interaction.reply('Failed to suspend license.');
                }
                interaction.reply(`License with ID \`${licenseId}\` has been suspended.`);
            });
        });
    }
};