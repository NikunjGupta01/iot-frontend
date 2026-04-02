

export function DeviceSettingsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Device Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure and manage your device parameters
        </p>
      </div>

    </div>
  );
}
