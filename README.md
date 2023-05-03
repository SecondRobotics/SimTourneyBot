# Sim Tourney Bot

A Discord bot for running simulation robotics tournaments in xRC Sim. Designed to expedite and simplify the process of running tournaments, and to provide a better experience for competitors.

[!] This project is currently a work in progress. [!]

- [x] Generates match schedules and player lists.
- [ ] Saves match results from xRC Simulator games to a Google Sheet.
- [ ] Updates team rankings based on match results.
- [ ] Notifies players of upcoming matches and results via Discord.
- [ ] Displays live game data on livestream overlays via OBS Lua scripts.

To be used for competitions and tournaments in the Unity-based game [xRC Simulator](http://xrcsimulator.org/). Used in online [SRC events](https://secondrobotics.org).

Powered by [Discord.js](https://discord.js.org/) and [Google Sheets API](https://developers.google.com/sheets/api). Based on the [NicholasBottone/xRCSim-Tourney-Runner](https://github.com/NicholasBottone/xRCSim-Tourney-Runner) CLI tool.

## Getting Started

- You must have a Discord bot application setup with a token.
- You must have a Google Sheet setup with an API Service Account.
- You must have a `.env` file in the root of the project, see [`.env.example`](./.env.example) for an example.
- Clone this repository and run `npm install` to install dependencies. Then run `npm run build` to build the project, and `npm start` to start the bot.
- Use `npm run dev` to start the bot in development mode. Use `npm run lint` to lint the code.

For a detailed tutorial, [click here to visit the wiki](https://github.com/SecondRobotics/SimTourneyBot/wiki).

## Contributing to this project

Feel free to create issues to report problems or suggestions. To make a code contribution, clone this repository then create a pull request.

This project is licensed under the GNU AGPLv3, meaning that as long as you provide attribution, you can do almost anything you want with this code, except distributing closed source versions.
