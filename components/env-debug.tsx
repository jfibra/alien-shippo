"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnvDebugProps {
  envVars: Record<string, string | undefined>
}

export function EnvDebug({ envVars }: EnvDebugProps) {
  const { toast } = useToast()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (key: string, value: string | undefined) => {
    if (value) {
      navigator.clipboard.writeText(value)
      setCopiedKey(key)
      toast({
        title: "Copied!",
        description: `Value for ${key} copied to clipboard.`,
      })
      setTimeout(() => setCopiedKey(null), 2000) // Reset copied state after 2 seconds
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50 bg-transparent">
          Debug Env
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Environment Variables Debugger</DialogTitle>
          <DialogDescription>
            View the environment variables accessible to this application.
            <br />
            <span className="font-semibold text-red-500">
              Warning: Do not expose sensitive keys on the client-side in production.
            </span>
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[80px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(envVars).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : "Undefined"}
                      </TableCell>
                      <TableCell className="text-right">
                        {value && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(key, value)}
                            disabled={copiedKey === key}
                          >
                            {copiedKey === key ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
