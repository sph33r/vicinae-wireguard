# WireGuard (NetworkManager) for Vicinae

Toggle WireGuard VPN tunnels from [Vicinae](https://docs.vicinae.com), backed by
[NetworkManager](https://networkmanager.dev/) via `nmcli`. Works on any Linux distro
and desktop environment that uses NetworkManager to manage WireGuard connections
(GNOME, KDE, Sway, Hyprland, etc.) — nothing here is KDE- or DE-specific.

## Requirements

- [Vicinae](https://docs.vicinae.com) installed and running.
- `nmcli` on your `PATH` (part of NetworkManager, installed by default on most
  distros).
- One or more WireGuard tunnels already added as NetworkManager connections.
  Check with:

  ```sh
  nmcli -f NAME,TYPE connection show
  ```

  If you have a `.conf` file instead, import it with:

  ```sh
  nmcli connection import type wireguard file /path/to/tunnel.conf
  ```

This extension does not manage tunnels configured purely through `wg-quick` /
`systemd-networkd` outside of NetworkManager.

## Commands

### WireGuard Connections

A list view of every WireGuard connection NetworkManager knows about, with live
connected/disconnected status. Select one and press <kbd>Enter</kbd> to connect
or disconnect it. Press <kbd>Ctrl</kbd>+<kbd>R</kbd> to refresh the list.

### Toggle WireGuard

A no-view command meant to be bound to a hotkey for instant connect/disconnect,
without opening the list. Shows a HUD with the result.

By default it picks a target automatically:

- if a tunnel is currently active, it disconnects that one;
- otherwise, if you have exactly one WireGuard connection configured, it connects
  that one.

If you run multiple tunnels and none are active, set the **Connection Name**
preference on this command (in Vicinae's extension preferences) to the exact
name shown by `nmcli connection show` — Vicinae will then always target that
connection.

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # validates package.json against the Vicinae manifest schema
npm run build        # builds and installs the extension into Vicinae
npm run dev           # hot-reloading dev session
```

`npm run build` installs the built extension directly into
`~/.local/share/vicinae/extensions/wireguard-nm`, where Vicinae picks it up
automatically.

## License

MIT
