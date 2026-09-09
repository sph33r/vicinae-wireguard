import { Action, ActionPanel, Color, Icon, List, showToast, Toast } from "@vicinae/api";
import { useCallback, useEffect, useState } from "react";
import { connectionDown, connectionUp, listWireGuardConnections, WireGuardConnection } from "./nmcli";

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
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (connection: WireGuardConnection) => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: connection.active ? `Disconnecting ${connection.name}` : `Connecting ${connection.name}`,
    });
    try {
      if (connection.active) {
        await connectionDown(connection.name);
      } else {
        await connectionUp(connection.name);
      }
      toast.style = Toast.Style.Success;
      toast.title = connection.active ? `Disconnected ${connection.name}` : `Connected ${connection.name}`;
      await refresh();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = connection.active ? `Failed to disconnect ${connection.name}` : `Failed to connect ${connection.name}`;
      toast.message = error instanceof Error ? error.message : String(error);
    }
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search WireGuard connections...">
      <List.EmptyView
        title="No WireGuard connections found"
        description="Add a WireGuard connection to NetworkManager (nmcli connection import type wireguard file <config>) to see it here."
        icon={Icon.Shield01}
      />
      {connections.map((connection) => (
        <List.Item
          key={connection.uuid}
          title={connection.name}
          icon={{
            source: connection.active ? Icon.Plug : Icon.WifiDisabled,
            tintColor: connection.active ? Color.Green : Color.SecondaryText,
          }}
          accessories={[
            {
              tag: {
                value: connection.active ? "Connected" : "Disconnected",
                color: connection.active ? Color.Green : Color.SecondaryText,
              },
            },
          ]}
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
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
