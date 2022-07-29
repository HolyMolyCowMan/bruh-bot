const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create a map of all the valid sounds of type {name, filename}
const sounds = fs.readdirSync('./sounds').filter(file => file.endsWith('.mp3')).map((file) => `\n${file.slice(0, -4)}`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sounds')
		.setDescription('A list of all available sounds.'),
	async execute(interaction) {
		// console.log(sounds);
		await interaction.reply(`Sounds:${sounds}`);
	},
};
