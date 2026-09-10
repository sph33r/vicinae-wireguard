import { getPreferenceValues, showHUD } from "@vicinae/api";
import { formatError, listWireGuardConnections, resolveTargetConnection, toggleConnection } from "./nmcli";

interface Preferences {
  connectionName?: string;
}

export default async function Command() {
  const { connectionName } = getPreferenceValues<Preferences>();

  let connections;
  try {
    connections = await listWireGuardConnections();
  } catch (error) {
    await showHUD(`Failed to query NetworkManager: ${formatError(error)}`);
    return;
  }

  if (connections.length === 0) {
    await showHUD("No WireGuard connections found in NetworkManager");
    return;
  }

  const target = resolveTargetConnection(connections, connectionName);

  if (!target) {
    await showHUD(
      connectionName
        ? `No WireGuard connection named "${connectionName}"`
        : "Multiple WireGuard connections found — set one in the command preferences",
    );
    return;
  }

  try {
    const wasActive = target.active;
    await toggleConnection(target);
    await showHUD(wasActive ? `Disconnected ${target.name}` : `Connected ${target.name}`);
  } catch (error) {
    await showHUD(`Failed to toggle ${target.name}: ${formatError(error)}`);
  }
}
