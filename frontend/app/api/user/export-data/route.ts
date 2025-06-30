import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")

    const response = await fetch("http://localhost:5000/api/user/export-data", {
      headers: {
        Authorization: token || "",
      },
    })

    if (response.ok) {
      const data = await response.blob()
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=budget-smart-data.json",
        },
      })
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
