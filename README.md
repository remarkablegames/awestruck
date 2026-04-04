<p align="center">
  <img src="public/favicon.png" width="200" alt="Awestruck">
</p>

# Awestruck

[![release](https://img.shields.io/github/v/release/remarkablegames/awestruck)](https://github.com/remarkablegames/awestruck/releases)
[![build](https://github.com/remarkablegames/awestruck/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/awestruck/actions/workflows/build.yml)

✨ Awestruck

Play the game on:

- [remarkablegames](https://remarkablegames.org/awestruck/)

## Credits

- [AstreFone](https://soundcloud.com/astrefone) (Music)
- [Blue_Fox](https://ko-fi.com/bluefox77551) (Art)
- [Mark](https://github.com/remarkablemark) (Programming)
- [Heal Up](https://pixabay.com/sound-effects/film-special-effects-heal-up-39285/)
- [Health Pickup](https://pixabay.com/sound-effects/film-special-effects-health-pickup-6860/)
- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds)
- [Punch Sound Effects](https://pixabay.com/sound-effects/film-special-effects-punch-sound-effects-28649/)

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/awestruck.git
cd awestruck
```

Install the dependencies:

```sh
npm install
```

Update the files:

- [ ] `public/app-icon.png`
- [ ] `public/favicon.png`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), [newgrounds](https://www.newgrounds.com/), etc.

## Testing

The game supports a few querystring overrides for debugging/playtesting fresh runs.

- `floor`: start on a specific floor from `1` to `4`
- `reward`: start on a specific reward from `1` to `3`
- `handSize`: change the opening hand size and normal turn draw size
- `deck`: provide a comma-separated list of card IDs, or `*` to load all cards

Start at floor 4:

```
http://localhost:5173/?floor=4
```

Start at reward 1:

```
http://localhost:5173/?reward=1
```

Start with all cards:

```
http://localhost:5173/?deck=*&handSize=30
```

Start with specific cards:

```
http://localhost:5173/?deck=burn,thorn,focus
```

Notes:

- Query overrides are applied only when creating a fresh run
- Invalid values fall back to the default run setup
- `deck` uses card IDs, not display labels

## License

[MIT](LICENSE)
