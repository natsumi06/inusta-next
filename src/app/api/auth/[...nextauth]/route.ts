import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  return new NextResponse("hello world!");
}
