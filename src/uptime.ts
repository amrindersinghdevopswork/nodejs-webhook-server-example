type HeartbeatOptions = {
  pingUrl?: string;
  intervalMs?: number;
};

export const startHeartbeat = ({
  pingUrl,
  intervalMs = 5 * 60 * 1000,
}: HeartbeatOptions = {}) => {
  if (!pingUrl) {
    return undefined;
  }

  const ping = async () => {
    try {
      const response = await fetch(pingUrl);
      if (!response.ok) {
        console.warn(`Heartbeat ping failed with status ${response.status}`);
        return;
      }

      console.log(`Heartbeat ping succeeded for ${pingUrl}`);
    } catch (error) {
      console.warn("Heartbeat ping failed:", error);
    }
  };

  void ping();

  return setInterval(() => {
    void ping();
  }, intervalMs);
};
