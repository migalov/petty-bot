const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { movieApiKey } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription("Get information about a movie!")
        .addStringOption(option => (
            option.setName("title")
            .setDescription("The title of the movie")
            .setRequired(true)
        )),
        async execute(interaction) {
            await interaction.deferReply();

            const movieTitle = interaction.options.getString("title");
            const apiURL = "http://www.omdbapi.com/";

            try {
                const response = await axios.get(apiURL, {
                    params: {
                        apiKey: movieApiKey,
                        t: movieTitle
                    }
                });

                const movieData = response.data;

                console.log(response.data);



                if(movieData.Error) {
                    await interaction.editReply(`Error: ${movieData.Error}`);
                    return;
                }

                const embed = {
                    color: 0x800000,
                    title: movieData.Title,
                    description: movieData.Plot,
                    thumbnail: {
                        url: movieData.Poster
                    },
                    fields: [
                        { name: "Runtime", value: movieData.Runtime, inline: true },
                        { name: "Rated", value: movieData.Rated, inline: true },
                        { name: "Released", value: movieData.Released, inline: true },

                        { name: "Metascore", value: movieData.Metascore, inline: true },
                        { name: "IMDb", value: movieData.imdbRating, inline: true },

                        { name: "Genre", value: movieData.Genre },
                        { name: "Director", value: movieData.Director },
                        { name: "Box Office", value: movieData.BoxOffice }
                    ]
                }

                await interaction.editReply({ embeds: [embed] });
                
            }

            catch(error) {
                console.error("Error fetching movie data: ", error)
                await interaction.editReply("There was an error while fetching the movie information")
            }
        }
    
}