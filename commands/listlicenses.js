const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listlicenses')
        .setDescription('List licenses based on type or username')
        .addStringOption(option => option.setName('type').setDescription('Filter by all/active/inactive/suspended').setRequired(true))
        .addStringOption(option => option.setName('username').setDescription('Filter by username').setRequired(false)),

    async execute(interaction, db) {
        const type = interaction.options.getString('type');
        const username = interaction.options.getString('username');

        let query = "SELECT * FROM licenses WHERE 1=1";
        const params = [];

        if (type !== 'all') {
            query += " AND status = ?";
            params.push(type);
        }

        if (username) {
            query += " AND username = ?";
            params.push(username);
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                console.error(err.message);
                return interaction.reply('Failed to fetch licenses.');
            }

            if (rows.length === 0) {
                return interaction.reply('No licenses found.');
            }

            const licensesList = rows.map(row => `ID: ${row.id} | Product: ${row.product_name} | Username: ${row.username} | Status: ${row.status}`).join('\n');
            interaction.reply(`**Licenses:**\n${licensesList}`);
        });
    }
};