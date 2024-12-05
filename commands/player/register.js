const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { movieApiKey } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regme')
        .setDescription("Добавить пользователя Discord"),
        async execute(interaction) {
            await interaction.deferReply();

            const urlDiscordUsers = `${process.env.URL_HOST_API}/discord-users`

            try {
                await axios.post(urlDiscordUsers, {
                    "data": {
                        "discordUserId": interaction.user.id
                    }
                });

                await interaction.editReply("Я внесла ваш номер в реестр. Теперь вы можете записывать своего персонажа в базу данных.")
            }

            catch(error) {
                await interaction.editReply("Либо я вас уже зарегистрировала, либо на сервере что-то не так.")
            }
        }
    
}