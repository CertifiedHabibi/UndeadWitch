// commands/utility/event.js
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const path = require("path");

const channelId = '1439753955000188978';
const emojiId = '1444010444271390881';
const emojiName = "wings";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Set up the event role reaction message.'),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has('ManageRoles')) {
            return interaction.reply({content: 'You need the Manage Roles permission.', ephemeral: true});
        }

        await interaction.deferReply({ephemeral: true});

        const embed = new EmbedBuilder()
            .setTitle("Event Role Requirements")
            .setDescription(
                `Click on the <:${emojiName}:${emojiId}> Button to receive or remove the event role!\n\nRequirements:\n` +
                `• 7+ days in the server\n` +
                `• Have **one** pronoun role\n` +
                `• Have **one** age role`
            )
            .setThumbnail("attachment://UndeadWitch.png")
            .setColor(0x000000);

        const btn = new ButtonBuilder()
            .setCustomId("event-access")
            .setLabel("Get Event Access")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji({id: "1444010444271390881", name: "wings"});

        const row = new ActionRowBuilder().addComponents(btn);

        const channel = client.channels.cache.get(channelId);
        await channel.send({
            embeds: [embed],
            components: [row],
            files: [
                {
                    attachment: path.join(__dirname, "..", "..", "assets", "UndeadWitch.png"),
                    name: "UndeadWitch.png",
                }
            ]
        });

        await interaction.editReply({content: "Event button created!", ephemeral: true});
    }
};
