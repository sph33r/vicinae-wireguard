import { Action, ActionPanel, Form, Icon, popToRoot, showToast, Toast } from "@vicinae/api";
import { useState } from "react";
import { formatError, importWireGuardConfig } from "./nmcli";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: Form.Values) => {
    const path = (values.file as string[] | undefined)?.[0];
    if (!path) {
      await showToast({ style: Toast.Style.Failure, title: "Choose a WireGuard config file" });
      return;
    }

    setIsLoading(true);
    try {
      await importWireGuardConfig(path);
      await showToast({ style: Toast.Style.Success, title: "Imported WireGuard connection" });
      await popToRoot();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to import connection",
        message: formatError(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Import" icon={Icon.Plus} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="file"
        title="Config File"
        info="A WireGuard .conf file to import into NetworkManager."
        allowMultipleSelection={false}
        canChooseDirectories={false}
      />
    </Form>
  );
}
