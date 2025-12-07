import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import 'dotenv/config' 

const STOCK_API_URL = process.env.STOCK_API_URL;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json(
            { error: "Missing required query parameter: name" },
            { status: 400 }
        );
    }

    const apiKey = process.env.INDIAN_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Server configuration error: missing INDIAN_API_KEY" },
            { status: 500 }
        );
    }

    try {
        const { data } = await axios.request({
            method: "GET",
            url: STOCK_API_URL,
            params: { name },
            headers: {
                "X-Api-Key": apiKey
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching stock data:", error);

        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                {
                    error: "Failed to fetch stock data",
                    details: error.response?.data ?? error.message
                },
                { status: error.response?.status ?? 502 }
            );
        }

        return NextResponse.json(
            { error: "Unexpected server error while fetching stock data" },
            { status: 500 }
        );
    }
}

