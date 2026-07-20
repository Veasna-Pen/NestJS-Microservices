type CircuitStats = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitStats = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;

  constructor(
    private readonly failureThreshold = 5,
    private readonly recoveryTimeout = 30000,
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      const elapased = Date.now() - (this.lastFailureTime ?? 0);
      if (elapased < this.recoveryTimeout) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
