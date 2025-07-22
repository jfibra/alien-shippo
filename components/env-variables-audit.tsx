// Server Component – safe to access env vars because it isn't bundled for the client.
export const EnvVariablesAudit = async () => {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_SECRET_KEY",
    "SHIPPO_API_KEY", // **private**, do NOT expose the value
  ] as const

  // We only show whether each variable is present (✅/❌), never its value.
  const rows = required.map((key) => ({
    key,
    present: Boolean(process.env[key]),
  }))

  return (
    <div className="rounded-lg border p-4 mt-6">
      <h2 className="font-semibold mb-3">Environment Variables Audit</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b last:border-none">
              <td className="py-1 pr-4 font-mono">{row.key}</td>
              <td className="py-1">{row.present ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Export named + default to satisfy all import styles.
export default EnvVariablesAudit
