const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createlicense')
        .setDescription('Create a new license')
        .addStringOption(option => option.setName('product_name').setDescription('Product name').setRequired(true))
        .addStringOption(option => option.setName('username').setDescription('Username').setRequired(true))
        .addStringOption(option => option.setName('start').setDescription('Start time (current_time/settime)').setRequired(true))
        .addStringOption(option => option.setName('expiry').setDescription('Expiry time (settime/NA)').setRequired(true)),

    async execute(interaction, db) {
        const productName = interaction.options.getString('product_name');
        const username = interaction.options.getString('username');
        const start = interaction.options.getString('start') === 'current_time' 
            ? Math.floor(Date.now() / 1000) 
            : interaction.options.getString('start');
        const expiry = interaction.options.getString('expiry') === 'NA' 
            ? 'NA' 
            : Math.floor(new Date(interaction.options.getString('expiry')).getTime() / 1000);

        const licenseId = crypto.randomUUID();

        db.run(`INSERT INTO licenses (id, product_name, username, start_time, expiry_time, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [licenseId, productName, username, start, expiry, 'active'],
            function(err) {
                if (err) {
                    console.error(err.message);
                    return interaction.reply('Failed to create license.');
                }

                const embed = new EmbedBuilder()
                    .setTitle('🎫 License Created Successfully')
                    .setColor('#00FF00')
                    .addFields(
                        { name: 'License ID', value: licenseId, inline: true },
                        { name: 'Product Name', value: productName, inline: true },
                        { name: 'Username', value: username, inline: true },
                        { name: 'Start Time', value: `<t:${start}:F>`, inline: true },
                        { name: 'Expiry Time', value: expiry === 'NA' ? 'NA' : `<t:${expiry}:F>`, inline: true },
                        { name: 'Status', value: 'Active', inline: true }
                    )
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
    }
};