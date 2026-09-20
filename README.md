# WireGuard (NetworkManager) for Vicinae

**Linux Only**

Manage WireGuard VPN tunnels from [Vicinae](https://vicinae.com) using 
NetworkManager via `nmcli`. Works on any Linux desktop environment or 
window manager that uses NetworkManager for WireGuard 
(GNOME, KDE, Sway, Hyprland, etc.).
 
This extension does not manage tunnels configured purely through `wg-quick` /
`systemd-networkd` outside of NetworkManager.

## AI Disclosure

This was created with the help of Claude Code. The code was reviewed by me as well
as different agents for code, security, and simplicity.

This just interfaces with nmcli as your user, it does not use root or any external
commands, it's the same as if you were running the nmcli command yourself.

## Reasoning For Creation

I was dabbling with Sway and didn't want to manage my Wireguard connection via the CLI.
In KDE you can manage it directly in the Network settings, Gnome has a decent
extension for managing Wireguard, but I want to use the same method regardless
of the DE/WM I'm using.

Vicinae is a great launcher and I use it in all my Linux desktops so I made this.

Windows and MacOS have their own apps and ways to trigger tunnels, I'm not catering
to them here, this is Linux only.

## Requirements

- [Vicinae](https://vicinae.com) installed and running.
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

## Installation

I have not published this to the Vicinea extension store yet. I may never do that, 
I'm still weirded out sharing code that I agentically made for myself.

To install, you need to follow the development instructions below. You really only need
to run the following:

```sh
npm install
npm run build
```

But you may want to run the other parts if it makes you feel better.

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
