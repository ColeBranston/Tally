# Description

Typescript electron app with bundled sqlite database for consistency tracking and testing UI designs.

_Note:_ Electron is normally difficult to setup with a bundled sqlite database so even after running `npm ci` or `npm install` you have to run `npx @electron/rebuild -f -w better-sqlite3`, this will rebuild you're better-sqlite3 verson to the correct version
