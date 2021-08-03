# pataka-cli

## Usage

Install Node 14 LTS with e.g. [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)

```bash
$ npm install -g pataka-cli
$ pataka
```

This will log out:
- `host` : the hostname your pataka will be connected to over (you generally want this to be accessible on the internet)
- `port` : the local port your pataka will be listening on
- `feedId` : the unique scuttlebutt id of this pataka (for debugging)
- `data` : path to where data is being stored for this instance 
- `config` : path to where you can persist custom config


## Config

You can modify which `port` and `hostname` are used if by editing the `config` file output above.
Here's en example config (note all fields are optional)

```json
{
  "port": "8068",
  "pataka": {
    "host": "mydomain.nz"
  }
}
```

You can also use ENV VAR (these will over-ride the config file):
- `PORT` (default: 8088)
- `PATAKA_HOST`
- `PATAKA_INVITE_USES` (default: 1000)
- 

