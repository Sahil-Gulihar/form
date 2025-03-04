import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export function GET() {
    const cookieStore = cookies();

    try {
        // const response = NextResponse.json({
        //     message: "Logout Successful",
        //     success: true,
        // });

        const token = cookieStore.get("auth_token");

        if (token === undefined || token === null) {
            return NextResponse.json(
                { error: "No token found", success: false },
                {
                    status: 400,
                },
            );
        } else {
            cookies().delete("auth_token");
            return NextResponse.json(
                { message: "Logout Successful", success: true },
                {
                    status: 200,
                },
            );
        }

        // return response;
    } catch (error: unknown) {
        const Error = error as Error;
        return NextResponse.json({ error: Error.message });
    }
}