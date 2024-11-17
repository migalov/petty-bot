const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription("Gives you a random dog photo!"),
    async execute(interaction) {
        await interaction.deferReply();
        try {

            const response = await axios.get("https://dog.ceo/api/breeds/image/random")
            const { message: photoURL } = response.data;

            const embed = {
                title: "Random doggo photo just for YOU!",
                image: {
                    url: photoURL
                }
            };

            await interaction.editReply({
                embeds: [embed]
            })

            // console.log(response.data);
            // await interaction.editReply(`Test`);
        }
        catch(error) {
            console.error(error)
            await interaction.editReply("Unable to get a random dog photo!")
        }
    }
    
}