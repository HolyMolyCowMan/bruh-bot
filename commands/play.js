const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays soundbites')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the sound to play')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to play the sound in')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
