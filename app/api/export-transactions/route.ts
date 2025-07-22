import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { format } from "date-fns"

export async function GET(request: Request) {
  try {
    // Get the current user
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get query parameters
    const url = new URL(request.url)
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")
    const formatParam = url.searchParams.get("format") || "csv" // Default to CSV

    // Build query
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Add date filters if provided
    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      // Add one day to include the end date fully
      const nextDay = new Date(endDate)
      nextDay.setDate(nextDay.getDate() + 1)
      query = query.lt("created_at", nextDay.toISOString())
    }

    // Execute query
    const { data: transactions, error } = await query

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "No transactions to export." }, { status: 200 })
    }

    // Format the data based on requested format
    if (formatParam === "json") {
      // Return JSON data
      return NextResponse.json({ transactions }, { status: 200 })
    } else {
      // Convert to CSV
      const headers = [
        "Transaction ID",
        "Type",
        "Amount",
        "Currency",
        "Status",
        "Description",
        "Created At",
        "Updated At",
      ]
      const csvRows = [headers.join(",")]

      // Add transaction data
      transactions.forEach((transaction) => {
        const row = [
          transaction.id,
          transaction.transaction_type,
          transaction.amount ? transaction.amount.toFixed(2) : "0.00",
          transaction.currency || "USD",
          transaction.status || "Completed",
          transaction.description ? `"${transaction.description.replace(/"/g, '""')}"` : "", // Handle commas and quotes in description
          format(new Date(transaction.created_at), "yyyy-MM-dd HH:mm:ss"),
          format(new Date(transaction.updated_at), "yyyy-MM-dd HH:mm:ss"),
        ]
        csvRows.push(row.join(","))
      })

      const csvContent = csvRows.join("\n")

      // Set headers for file download
      const responseHeaders = new Headers()
      responseHeaders.set("Content-Type", "text/csv")
      responseHeaders.set(
        "Content-Disposition",
        `attachment; filename="transactions-${format(new Date(), "yyyyMMdd_HHmmss")}.csv"`,
      )

      return new NextResponse(csvContent, {
        status: 200,
        headers: responseHeaders,
      })
    }
  } catch (error) {
    console.error("Error exporting transactions:", error)
    return NextResponse.json({ error: "Failed to export transactions" }, { status: 500 })
  }
}
