const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { hostAPI } = require("../../config.json");
const qs = require("qs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinraid')
        .setDescription("Присоединиться к рейдам")
        .addStringOption(option => 
            option.setName("character")
            .setDescription("Выберите персонажа для рейда")
            .setRequired(true)
            .setAutocomplete(true)),
    async execute(interaction) {
        const character = interaction.options.getString("character").split(";");
        const name = character[0];
        const documentid = character[1];
        await interaction.reply(`Вы выбрали персонажа ${name}; documentId = ${documentid}`);
    },
    async autocomplete(interaction) {
        const params = {
            filters: {
                discordUserId: interaction.user.id
            },
            populate: {
                characters: {
                    populate: "*"
                },
            }
        };
        const queryString = qs.stringify(params, { encode: true });
        const apiQuery = `${hostAPI}/discord-users?${queryString}`
        try {
            await axios.get(apiQuery)
            .then(res => {
                
                let mappedCharacters = res.data.data[0].characters.map(character => ({
                    name: String(`${character.characterClass.ruName}: ${character.name} [💎 ${character.gearscore}; 🌌 ${character.transcendence}; ⚔️ ${character.attackPower}]`),
                    value: String(`${character.name};${character?.documentId}`)
                }));
                interaction.respond(mappedCharacters);
            })
        }
        catch (error) {
            console.log(`Ошибка: ${error}`);                
        }
    },
};