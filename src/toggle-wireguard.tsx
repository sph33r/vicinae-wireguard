import { getPreferenceValues, showHUD } from "@vicinae/api";
import { connectionDown, connectionUp, listWireGuardConnections } from "./nmcli";

interface Preferences {
  connectionName?: string;
}

export default async function Command() {
  const { connectionName } = getPreferenceValues<Preferences>();

  let connections;
  try {
    connections = await listWireGuardConnections();
  } catch (error) {
    await showHUD(`Failed to query NetworkManager: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  if (connections.length === 0) {
    await showHUD("No WireGuard connections found in NetworkManager");
    return;
  }

  const target = connectionName
    ? connections.find((connection) => connection.name === connectionName)
    : (connections.find((connection) => connection.active) ?? (connections.length === 1 ? connections[0] : undefined));

  if (!target) {
    await showHUD(
      connectionName
        ? `No WireGuard connection named "${connectionName}"`
        : "Multiple WireGuard connections found — set one in the command preferences",
    );
    return;
  }

  try {
    if (target.active) {
      await connectionDown(target.name);
      await showHUD(`Disconnected ${target.name}`);
    } else {
      await connectionUp(target.name);
      await showHUD(`Connected ${target.name}`);
    }
  } catch (error) {
    await showHUD(`Failed to toggle ${target.name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
