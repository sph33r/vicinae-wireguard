import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type WireGuardConnection = {
  name: string;
  uuid: string;
  active: boolean;
};

async function nmcli(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("nmcli", args);
  return stdout;
}

export async function listWireGuardConnections(): Promise<WireGuardConnection[]> {
  const output = await nmcli(["-t", "-f", "NAME,UUID,TYPE,ACTIVE", "connection", "show"]);

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, uuid, type, active] = line.split(":");
      return { name, uuid, type, active: active === "yes" };
    })
    .filter((connection) => connection.type === "wireguard")
    .map(({ name, uuid, active }) => ({ name, uuid, active }));
}

export async function connectionUp(name: string): Promise<void> {
  await nmcli(["connection", "up", name]);
}

export async function connectionDown(name: string): Promise<void> {
  await nmcli(["connection", "down", name]);
}

export function resolveTargetConnection(
  connections: WireGuardConnection[],
  connectionName?: string,
): WireGuardConnection | undefined {
  if (connectionName) {
    return connections.find((connection) => connection.name === connectionName);
  }
  return connections.find((connection) => connection.active) ?? (connections.length === 1 ? connections[0] : undefined);
}

export async function toggleConnection(connection: WireGuardConnection): Promise<void> {
  if (connection.active) {
    await connectionDown(connection.name);
  } else {
    await connectionUp(connection.name);
  }
}

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
