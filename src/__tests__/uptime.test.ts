import { startHeartbeat } from "../uptime";

describe("startHeartbeat", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "fetch").mockResolvedValue({ ok: true } as Response);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("does not start a heartbeat when no ping URL is provided", () => {
    const interval = startHeartbeat();

    expect(interval).toBeUndefined();
  });

  it("sends a ping immediately and on interval", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const interval = startHeartbeat({ pingUrl: "https://example.com/ping", intervalMs: 1000 });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    await Promise.resolve();

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    if (interval) {
      clearInterval(interval);
    }
  });
});
