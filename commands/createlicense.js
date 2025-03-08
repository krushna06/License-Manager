const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const crypto = require('crypto');
const moment = require('moment-timezone');

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
        const startInput = interaction.options.getString('start');
        const expiryInput = interaction.options.getString('expiry');

        const parseTime = (input, isExpiry = false) => {
            const indiaTime = moment.tz('Asia/Kolkata');

            if (input === 'current_time') {
                return Math.floor(indiaTime.unix());
            }

            if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
                return Math.floor(moment(input, 'DD/MM/YYYY').unix());
            }
            if (/^\d{2}\/\d{2}$/.test(input)) {
                const [hour, minute] = input.split('/').map(Number);
                indiaTime.set('hour', hour).set('minute', minute).set('second', 0).set('millisecond', 0);
                return Math.floor(indiaTime.unix());
            }
            if (/^\d{2}\/\d{2}\/\d{4} \d{2}\/\d{2}$/.test(input)) {
                const [date, time] = input.split(' ');
                const [day, month, year] = date.split('/').map(Number);
                const [hour, minute] = time.split('/').map(Number);
                indiaTime.set('year', year).set('month', month - 1).set('date', day).set('hour', hour).set('minute', minute).set('second', 0).set('millisecond', 0);
                return Math.floor(indiaTime.unix());
            }
            if (/^\d+MM$/.test(input)) {
                return Math.floor(indiaTime.unix()) + parseInt(input.replace('MM', '')) * 60;
            }
            if (/^\d+H$/.test(input)) {
                return Math.floor(indiaTime.unix()) + parseInt(input.replace('H', '')) * 3600;
            }

            return null;
        };

        const start = parseTime(startInput);

        const expiry = expiryInput === '12HH' ? Math.floor(moment().unix()) + (12 * 60 * 60) : parseTime(expiryInput) || 'NA';

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
                        { name: 'Start Time', value: start === 'NA' ? 'NA' : `<t:${start}:F>`, inline: true },
                        { name: 'Expiry Time', value: expiry === 'NA' ? 'NA' : `<t:${expiry}:F>`, inline: true },
                        { name: 'Status', value: 'Active', inline: true }
                    )
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
    }
};
