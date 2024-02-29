export interface CapacitorTrapPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
