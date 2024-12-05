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
            const urlCharacters = `${process.env.URL_HOST_API}/characters?populate=*`;
            // const urlDiscordUsers = `${process.env.URL_HOST_API}/discord-users`;

            try {
                // const responseDiscordUserId = await axios.post(urlDiscordUsers, {
                //     "data": {
                //         "discordUserId": interaction.user.id
                //     }
                // });
                const responseCharacter = await axios.post(urlCharacters, {
                    "data": {
                        "name": nameCharacter,
                        // "discordUser": responseDiscordUserId.data.data[0].id
                    }
                });
                const characterData = await responseCharacter.data;
                const {name, roster, attackPower, gearscore, transcendence, characterClass} = characterData.data;
                console.log(characterData.data);
                
                if(characterData.Error) {
                    await interaction.editReply(`Error: ${characterData.Error}`);
                    return;
                }

                await interaction.editReply(`Персонаж добавлен!\nНик: ${name}\nКласс: ${characterClass.ruName}\nНаследие: ${roster}\nСила атаки: ${attackPower}\nУровень снаряжения: ${gearscore}\nУроень трансценденции: ${transcendence}`);
            }

            catch(error) {
                console.error("Error fetching data: ", error)
                await interaction.editReply("There was an error while fetching the information")
            }
        }
    
}