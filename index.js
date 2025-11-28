const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    Events,
} = require("discord.js");

require("dotenv/config");

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("The Undead Witch has awoken..."));
app.listen(3000, () => console.log("The Undead Witch Lingers..."));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Reaction, Partials.Message, Partials.User]
});

client.commands = new Collection();

// Load command definition from event.js
const command = require("./commands/utility/event.js");
client.commands.set(command.data.name, command);

client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isChatInputCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;

        return await cmd.execute(interaction, client);
    }


    const ageRoleIds = [
        '1392404401351557191',
        '1392404426232430692',
    ];
    
    const pronounRoleIds = [
        '1395885038679363724',
        '1395885066558771260',
        '1395885089539489985',
        '1395885172855144521',
        '1395885226386919485',
    ];
    
    const eventRoleID = '1394765728766234664';

    if (interaction.isButton() && interaction.customId === "event-access") {

        if (!interaction.inGuild()) {
            return interaction.reply({content: "This button only works in servers.", ephemeral: true});
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member) {
            return interaction.reply({content: "Couldn't fetch your server membership. Try again.", ephemeral: true});
        }


        if (member.roles.cache.has(eventRoleID)) {

            try {
                await member.roles.remove(eventRoleID);
                return interaction.reply({
                    content: "Your role has been removed successfully!",
                    ephemeral: true,
                });
            } catch (err) {
                console.error(`Failed to remove role ${eventRoleID} from ${member.id}`, err);
            }
        } else {

            if (!member.joinedAt) {
                return interaction.reply({
                    content: "Could not determine your join date. Try again later.",
                    ephemeral: true
                });
            }

            const unmet = [];
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const unlockTime = new Date(member.joinedAt.getTime() + sevenDaysMs);
            if (Date.now() < unlockTime.getTime()) {
                unmet.push(`• You haven't been in the server for 7 days.`);
            }

            // pronoun roles check
            if (Array.isArray(pronounRoleIds) && pronounRoleIds.length > 0) {
                if (!pronounRoleIds.some(id => member.roles.cache.has(id))) {
                    unmet.push('• You do not have a pronoun role.');
                }
            }

            // age roles check
            if (Array.isArray(ageRoleIds) && ageRoleIds.length > 0) {
                if (!ageRoleIds.some(id => member.roles.cache.has(id))) {
                    unmet.push('• You do not have an age role.');
                }
            }

            if (unmet.length > 0) {

                if(Date.now() < unlockTime.getTime()) {
                    return interaction.reply({
                        content: `${unmet.join('\n')}\nYou can get the role <t:${Math.floor(unlockTime.getTime() / 1000)}:R>.`,
                        ephemeral: true
                    });
                }
                return interaction.reply({
                    content: `You cannot get the role yet:\n${unmet.join('\n')}`,
                    ephemeral: true
                });
            } else {
                await member.roles.add(eventRoleID);
                return interaction.reply({
                    content: `You’ve been given the **Event Access** Role!`,
                    ephemeral: true
                });
            }

        }

    }
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const applyPresence = async () => {
        await client.user.setPresence({
            activities: [{name: "Watching your roles..."}],
            status: "online",
        });
    };

    await applyPresence();
    setInterval(applyPresence, 3600000);

    client.on("shardResume", applyPresence);
    client.on("shardReady", applyPresence);
});

client.login(process.env.TOKEN);
