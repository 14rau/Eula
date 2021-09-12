<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://cdn.discordapp.com/avatars/880880243873832990/f05e95557baeb877e082360979f3319d.webp?size=512" alt="Bot logo"></a>
</p>

<h3 align="center">eula</h3>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![Discord](https://img.shields.io/discord/774996035423567913?label=discord)](https://discord.gg/Zmtr88WBBx)


</div>

---

<p align="center"> Simple message deletion bot
    <br> 
</p>

## 📝 Table of Contents
- [Usage](#usage)
- [Getting Started](#getting_started)


## 💭 How it works <a name = "working"></a>

| Command  | Arguments | What it does |
| ------------- | ------------- | ------------- |
| /ignore  | user  | Messages of the provided user will be deleted  |
| /allow  | user  | Messages of the provided user will not be deleted anymore  |
| /about  | -  | Show some bot information  |


## 🏁 Getting Started <a name = "getting_started"></a>

When you follow this instructions, you can deploy Eula by yourself. You can either just run the bot, or you can use Docker to deploy the bot.

### Installing Dev Env

A step by step series of examples that tell you how to get a development env running.
First, clone the repository. You need atleast Node v16.8.0 to run this bot. Its also recommended to use `yarn` instead of `npm`.

Install all packages
```
yarn
```

Copy example.env file and name the copy `.env` and insert your bottoken

Watch filechanges
```
yarn watch
```
Restart on filechanges
```
yarn nodemon
```

Commands should be added into the `src/commands` folder. You can use the DataLoder class, to load/save Data as a json file. By default Eula will create a localdb.json file to store the data, since a database would be a overkill for this small project.

### Deploy
To deploy Eula by yourself, you have to have docker installed, and also created your `.env` and copied over your token. You can either use the docker-compose file, or just plain docker.