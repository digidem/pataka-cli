# pataka-cli

## Usage

Install Node 14 LTS with e.g. [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)

```bash
$ npm install -g pataka-cli
$ pataka
```

You will then see logged out:
- `web ui` : the urls that the web ui can be accessed at
- `host` : the hostname your pataka will be connected to over (you generally want this to be accessible on the internet)
- `port` : the local port your pataka scuttelbutt instance will be listening on
- `feedId` : the unique scuttlebutt id of this pataka (for debugging)
- `data` : path to where data is being stored for this instance 
- `config` : path to where you can persist custom config

To use this in the cloud, you might like to launch it with a tool like: [pm2](https://www.npmjs.com/package/pm2)

## Config

You can modify which `port` and `hostname` are used if by editing the `config` file output above.
Here's en example config (note all fields are optional)

```json
{
  "port": 8068,
  "pataka": {
    "host": "mydomain.nz",
    "webPort": 6700,
    "inviteUses": 10,
    "log": false
  }
}
```

You can also use ENV VAR (these will over-ride the config file):
- `PORT` (default: 8088)
- `PATAKA_HOST`
- `PATAKA_WEB_PORT` (default: 3000)
    - NOTE note sure port 80 will be will handled
- `PATAKA_LOG` controls logging, set to `true` to enable
- `PATAKA_INVITE_USES`
    - the pataka creates an invite code each time it's started, this specifies how many uses that code is valid for
    - (default: 1000)

NOTE: it's currently not only possible to set the local port the patkaka listens on - you cannot set the external port the invite code will use
If this external port is different you can manually edit the port invite code.

## :warning: WARNING

This module currently exposes an admin web page **without authentication**. It allows:
- setting the name of the pataka
- generating single-use invites for the pataka

## TODO

0. Add Authentication
1. find a way to not commit the raw `public/` folder
2. Make it so you can upload profile images (may be broken atm?)
3. There's an annoying error logged on startup.
    It's safe to ignore but looks scary, it needs tidying up

    ```
    Trace: deprecated api used: ssb-ref.parseAddress
        at Object.parseAddress (/home/username/.nvm/versions/node/v14.16.0/lib/node_modules/pataka-cli/node_modules/ssb-ref/index.js:99:15)
        at Object.<anonymous> (/home/username/.nvm/versions/node/v14.16.0/lib/node_modules/pataka-cli/node_modules/ssb-invite/index.js:97:24)
        at apply (/home/username/.nvm/versions/node/v14.16.0/lib/node_modules/pataka-cli/node_modules/muxrpc-validation/index.js:197:15)
        ...
    ```


### Development

```bash
$ git clone https://gitlab.com/ahau/pataka-cli.git
$ cd pataka-cli
$ npm i
$ npm start
```

to start in development pataka env:
```bash
$ npm run dev
```

To update the dependencies to be in line with `pataka`
```bash
$ cd ~/projects/pataka
$ npm link pataka
$ cd ~/projects/pataka-cli
$ npm run syncDeps
```

To update the UI to be in line with `pataka`
```bash
$ cd ~/projects/pataka/ui
$ npm run build
$ cp -R ../dist ~/projects/pataka-cli/public
```

