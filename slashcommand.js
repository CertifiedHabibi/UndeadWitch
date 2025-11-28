// slashcommand.js
const {REST, Routes} = require("discord.js");
require("dotenv/config");

const APP_ID = process.env.APP_ID;
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

// Load the command definition from event.js
const command = require("./commands/utility/event.js");

async function register() {
    const rest = new REST({version: '10'}).setToken(TOKEN);

    const commands = [command.data.toJSON()];

    try {
        console.log("Refreshing slash command…");

        await rest.put(
            Routes.applicationGuildCommands(APP_ID, GUILD_ID),
            {body: commands}
        );

        console.log("Slash command registered!");
    } catch (error) {
        console.error(error);
    }
}

register();
