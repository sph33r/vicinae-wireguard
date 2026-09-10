import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, showToast, Toast } from "@vicinae/api";
import { useCallback, useEffect, useState } from "react";
import { deleteConnection, formatError, listWireGuardConnections, toggleConnection, WireGuardConnection } from "./nmcli";

export default function Command() {
  const [connections, setConnections] = useState<WireGuardConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setConnections(await listWireGuardConnections());
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to list WireGuard connections",
        message: formatError(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (connection: WireGuardConnection) => {
    const verb = connection.active
      ? { ing: "Disconnecting", done: "Disconnected", fail: "disconnect" }
      : { ing: "Connecting", done: "Connected", fail: "connect" };

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: `${verb.ing} ${connection.name}`,
    });
    try {
      await toggleConnection(connection);
      toast.style = Toast.Style.Success;
      toast.title = `${verb.done} ${connection.name}`;
      await refresh();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = `Failed to ${verb.fail} ${connection.name}`;
      toast.message = formatError(error);
    }
  };

  const remove = async (connection: WireGuardConnection) => {
    const confirmed = await confirmAlert({
      title: `Delete "${connection.name}"?`,
      message: "This removes the connection from NetworkManager. This cannot be undone.",
      primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
    });
    if (!confirmed) return;

    try {
      await deleteConnection(connection.uuid);
      await showToast({ style: Toast.Style.Success, title: `Deleted ${connection.name}` });
      await refresh();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Failed to delete ${connection.name}`,
        message: formatError(error),
      });
    }
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search WireGuard connections...">
      <List.EmptyView
        title="No WireGuard connections found"
        description="Add a WireGuard connection to NetworkManager (nmcli connection import type wireguard file <config>) to see it here."
        icon={Icon.Shield01}
      />
      {connections.map((connection) => {
        const status = connection.active
          ? { icon: Icon.Plug, color: Color.Green, label: "Connected" }
          : { icon: Icon.WifiDisabled, color: Color.SecondaryText, label: "Disconnected" };

        return (
          <List.Item
            key={connection.uuid}
            title={connection.name}
            icon={{ source: status.icon, tintColor: status.color }}
            accessories={[{ tag: { value: status.label, color: status.color } }]}
            actions={
              <ActionPanel>
                <Action
                  title={connection.active ? "Disconnect" : "Connect"}
                  icon={connection.active ? Icon.WifiDisabled : Icon.Plug}
                  style={connection.active ? "destructive" : "regular"}
                  onAction={() => toggle(connection)}
                />
                <Action
                  title="Refresh"
                  icon={Icon.ArrowClockwise}
                  shortcut={{ modifiers: ["ctrl"], key: "r" }}
                  onAction={refresh}
                />
                <Action
                  title="Delete Connection"
                  icon={Icon.Trash}
                  style="destructive"
                  shortcut={{ modifiers: ["ctrl"], key: "x" }}
                  onAction={() => remove(connection)}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
