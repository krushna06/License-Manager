// index.js
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database('./database/licenses.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    product_name TEXT,
    username TEXT,
    start_time TEXT,
    expiry_time TEXT,
    status TEXT
)`);


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Pushed the commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, db);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/license/:licenseId', (req, res) => {
    const { licenseId } = req.params;

    db.get(`SELECT * FROM licenses WHERE id = ? AND status = 'active'`, [licenseId], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', message: 'Database error.' });
        }

        if (!row) {
            return res.status(404).json({ status: 'error', message: 'License not found or is inactive/suspended.' });
        }

        res.json({
            status: 'success',
            license: row
        });
    });
});

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});