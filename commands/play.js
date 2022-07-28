const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const sounds = fs.readdirSync('./sounds').filter(file => file.endsWith('.mp3')).map(file => ({ name : file.slice(0, -4), value : file }));
console.log(sounds);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays soundbites')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the sound to play')
				.setRequired(true)
				// Takes a list of objects
				.addChoices(...sounds))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to play the sound in')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
