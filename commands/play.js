const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	joinVoiceChannel,
	createAudioResource,
	createAudioPlayer,
	NoSubscriberBehavior,
	VoiceConnectionStatus,
	entersState,
	AudioPlayerStatus,
} = require('@discordjs/voice');

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

// Create a map of all the valid sounds of type {name, filename}
const sounds = new Map();
fs.readdirSync('./sounds').filter(file => file.endsWith('.mp3')).map(file => (sounds.set(file.slice(0, -4), file)));

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	}
	catch (err) {
		connection.destroy();
		throw err;
	}
}

function playSound(soundName) {
	player.play(createAudioResource(`./sounds/${sounds.get(soundName)}`));
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

// Export the module
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
	// The code to run
	async execute(interaction) {
		const soundName = interaction.options.getString('name');
		const channelFromMessage = interaction.options.getChannel('channel');
		let channel;

		// If it is a valid sound
		if (sounds.has(soundName)) {
			// If the channel is set
			if (channelFromMessage) {
				channel = await interaction.guild.channels.fetch(channelFromMessage.id);
			}
			// If the channel isn't provided, use the users
			else {
				channel = await interaction.guild.channels.fetch(interaction.member.voice.channelId);
			}

			const connection = await connectToChannel(channel);
			playSound(soundName);
			connection.subscribe(player);
			await interaction.reply(`Playing: '${soundName}' in ${channel.name}`);

			player.on('stateChange', (oldState, newState) => {
				if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle && connection.state.status === VoiceConnectionStatus.Ready) {
					connection.destroy();
				}
			});
		}
		else {
			await interaction.reply('No such sound broski');
		}
	},
};