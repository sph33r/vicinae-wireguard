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
  const [all, active] = await Promise.all([
    nmcli(["-t", "-f", "NAME,UUID,TYPE", "connection", "show"]),
    nmcli(["-t", "-f", "NAME", "connection", "show", "--active"]),
  ]);

  const activeNames = new Set(
    active
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

  return all
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, uuid, type] = line.split(":");
      return { name, uuid, type };
    })
    .filter((connection) => connection.type === "wireguard")
    .map(({ name, uuid }) => ({ name, uuid, active: activeNames.has(name) }));
}

export async function connectionUp(name: string): Promise<void> {
  await nmcli(["connection", "up", name]);
}

export async function connectionDown(name: string): Promise<void> {
  await nmcli(["connection", "down", name]);
}
