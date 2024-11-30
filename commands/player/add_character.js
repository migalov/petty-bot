const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { movieApiKey } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addch')
        .setDescription("Добавить персонажа в базу данных")
        .addStringOption(option => (
            option.setName("name")
            .setDescription("Добавить персонажа в базу данных")
            .setRequired(true)
        )),
        async execute(interaction) {
            await interaction.deferReply();

            const nameCharacter = interaction.options.getString("name");
            const apiURL = `${process.env.URL_HOST_API}/characters?populate=*`;

            try {
                const response = await axios.post(apiURL, {
                    "data": {
                        "name": nameCharacter
                    }
                });
                const characterData = response.data;
                const {name, roster, attackPower, gearscore, transcendence, characterClass} = characterData.data;
                if(characterData.Error) {
                    await interaction.editReply(`Error: ${characterData.Error}`);
                    return;
                }

                await interaction.editReply(`Персонаж добавлен!\nНик: ${name}\nНик: ${characterClass.ruName}\nНаследие: ${roster}\nСила атаки: ${attackPower}\nУровень снаряжения: ${gearscore}\nУроень трансценденции: ${transcendence}`);
            }

            catch(error) {
                console.error("Error fetching data: ", error)
                await interaction.editReply("There was an error while fetching the information")
            }
        }
    
}