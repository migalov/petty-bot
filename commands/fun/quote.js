const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription("Gives you the quote of the day!"),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get("https://zenquotes.io/api/today");
            const { q: quote, a: author} = response.data[0]
                       
            await interaction.editReply(`"${quote}" - ${author}`);
        }
        catch(error) {
            console.error(error)
            await interaction.editReply("Unable to get the quote of the day!")
        }
    }
    
}