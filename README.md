# WireGuard (NetworkManager) for Vicinae

Manage WireGuard VPN tunnels from [Vicinae](https://docs.vicinae.com), backed by
[NetworkManager](https://networkmanager.dev/) via `nmcli`. Works on any Linux
desktop environment that uses NetworkManager for WireGuard (GNOME, KDE, Sway,
Hyprland, etc.) — nothing here is DE-specific.

This extension does not manage tunnels configured purely through `wg-quick` /
`systemd-networkd` outside of NetworkManager.

## AI Disclosure

This was created with the help of Claude Code. If that makes you angry, so be it.
I built this for me to make my life easier; I'm just sharing it in case others
need something like it.

## Requirements

- [Vicinae](https://docs.vicinae.com) installed and running.
- `nmcli` on your `PATH` (part of NetworkManager, installed by default on most
  distros).
- At least one WireGuard tunnel added as a NetworkManager connection. Use the
  **Import WireGuard Tunnel** command below, or:

  ```sh
  nmcli connection import type wireguard file /path/to/tunnel.conf
  ```

## Commands

### WireGuard Connections

Lists every WireGuard connection NetworkManager knows about, with live
connected/disconnected status.

- <kbd>Enter</kbd> — connect or disconnect the selected tunnel
- <kbd>Ctrl</kbd>+<kbd>R</kbd> — refresh the list
- <kbd>Ctrl</kbd>+<kbd>X</kbd> — delete the selected connection (with
  confirmation)

### Toggle WireGuard

A no-view command for binding to a hotkey — instant connect/disconnect without
opening the list. Shows a HUD with the result.

By default it picks a target automatically:

- if a tunnel is currently active, it disconnects that one;
- otherwise, if you have exactly one WireGuard connection configured, it
  connects that one.

If you run multiple tunnels and none are active, set the **Connection Name**
preference on this command to the exact name shown by `nmcli connection show`
so it always targets that connection.

### Import WireGuard Tunnel

A form for picking a `.conf` file and importing it into NetworkManager as a
new WireGuard connection.

## Development

```sh
npm install
npm run typecheck  # tsc --noEmit
npm run lint       # validates package.json against the Vicinae manifest schema
npm run build      # builds and installs the extension into Vicinae
npm run dev        # hot-reloading dev session
```

`npm run build` installs the built extension directly into
`~/.local/share/vicinae/extensions/wireguard-nm`, where Vicinae picks it up
automatically.

## License

MIT
