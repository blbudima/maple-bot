# maple-bot

**This is the `master` branch. This branch is designed for the bot to be hosted on your local machine.**

Maple-bot is a simple Discord bot that allows server members to create their own profile of characters and to view other members' profiles and characters. Some features include:

- Adding, editing, and deleting a character to your profile
- Listing all characters in the server or for a specific game
- Showing your own profile or the profile of another member in the same server

This bot was developed from scratch using [discord.js](https://discord.js.org/#/) and [mongoose](https://mongoosejs.com/).

**I do not have any intentions of scaling this bot publicly**. I made maple-bot for my friends and for fun, so I am releasing my source in hopes that others can use it for their own recreational use as well. You are also welcome to use this bot as a template for your own bot or for coding practice.

## Set-up

Before you download the code and deploy maple-bot, you will first need to create a [Discord application](https://discord.com/developers/applications). Go ahead and click the link, select `New Application`, then name your bot whatever you want. I named my application `maple-bot`.

Once your application has been created, click on `Bot` in the `SETTINGS` menu to the left. Go ahead and click `Add Bot` to create a bot for this application.

On the `Bot` page, click on `Click to Reveal Token`. **This is your personal bot token that you will use to log-in your Discord bot. Do not reveal this token to anyone else as this token alone can allow others to take control of your bot.** Take a mental note of the location of this token for now.

Once you have the `Bot` enabled, click on `OAuth2` in the `SETTINGS` menu. Within the `SCOPES`, select `bot`. Within `BOT PERMISSIONS`, select `Send Messages`, `Manage Messages`, `Embed Links`, `Attach Files`, `Read Message History`, and `Add Reactions`. These are the permissions your bot needs to function. Once you have selected the permissions, go ahead and `Copy` the link within the `SCOPES` box, and paste it into your URL.

You should be directed to a screen with a drop-down menu. Select the server for your bot, then click `Authorize`.

Congratulations - you now have your own Discord bot!

## Customization

The easiest way to customize the bot is to `Fork` my [repository](https://github.com/blbudima/maple-bot) to add it to your account. You should make a [GitHub account](https://github.com/join) if you have not done so. Once logged in, you should see the option to fork my repository on the top-right.

Once you have forked my repository, you should be redirected to the repository on your own account. From here, you can clone your repository to your computer. You can clone your repository this via [Git](https://git-scm.com/docs/git-clone) or [GitHub Desktop](https://desktop.github.com/).

Once you have the repository cloned, go ahead and make some changes to make the bot personal to you! The official [discord.js guide](https://discordjs.guide/) is a fantastic place to start as it is useful in learning the basics to Discord botting as well as offering some fundamental Javascript knowledge. If you feel a bit more adventurous, then you can check out the [discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome). You can also choose to make no changes. Make sure you push your changes to your GitHub respository!

You should also look into [node.js](https://nodejs.org/en/), a JavaScript runtime that can help you run your bot locally. The official discord.js guide covers using node.js to compile and run your JavaScript code.

Furthermore, this bot uses [mongoose](https://mongoosejs.com/) to connect to MongoDB. You can create a free database cluster [here](https://www.mongodb.com/).

**NOTE: Even if you choose not to make any changes to the bot, you MUST create a file titled `config.json` to the top directory of maple-bot. This file is used to log-in your bot as well as to define several other variables used by the bot.**

Go ahead and create a file named `config.json` within the top directory of maple-bot, then paste the following code inside the file.

```
{
  "token": "your-token-here",
  "prefix": "!!",
  "defaultCooldown": 1,
  "mongoPW": "your-pw-here",
  "mongoDB": "your-db-here",
}
```

**Replace `your-token-here` with your personal bot token (remember where to find this?).**

For `prefix`, enter a character sequence that represents the prefix to activate the bot commands (e.g. you might have needed to type `!` or a `;;` to activate certain bots - this is the prefix!). I have mine set at `!!`.

For `defaultCooldown`, enter an integer that represents the cooldown between commands in seconds that will help prevent command-spamming for your bot. I have mine set at `3`.

For `mongoPW`, enter a string that represents the password for your MongoDB.

For `mongoDB`, enter a string that represents the database for your MongoDB.

**If you are able to code the bot to your personal preference and are able to test it as well, then you should already know how to deploy your bot!** You can stop here if you want. Otherwise, if you still need assistance in deploying the bot, then the next section covers how to deploy the bot through your local computer.

## Deployment

The code on this current branch (master) is designed to be deployed locally (meaning it will run as a program on your computer). In my case, I am using [node.js](https://nodejs.org/en/) to compile and run maple-bot!

**These following steps assume that you are running a Windows machine.**

First of all, download and install [node.js](https://nodejs.org/en/). Download the LTS version.

Once you have made your changes to your bot (or maybe you didn't), go ahead and open up the maple-bot directory in Windows Explorer.

Press `shift + right-click` on an empty area in your Windows Explorer, then select `Open PowerShell window here`. A Windows PowerShell menu should pop up.

From here, type `npm install`. This will install all the packages needed for your project.

Once everything has finished installing, type `npm start`.

If you have successfully deployed the bot, then you should be able to see it online in your Discord server. Another way to check if the bot is working is to check the output of PowerShell. Within the output, you should see this output: `ready!`.

## Wrap-up

Congratulations - you deployed your own personal maple-bot! Go ahead and try to add some characters to your profile!
