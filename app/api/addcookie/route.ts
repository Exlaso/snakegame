import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

const jwt = require('jsonwebtoken');
export const POST = async (req: NextRequest) => {
    try {

        const body: APIADDCOOKIE = await req.json();
        const a = jwt.sign(body, process.env.JWTKEY)
        cookies().set("token", a, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });


        return NextResponse.json(true)
    } catch (error) {
        console.error("Error in app/api/addcookie/route.ts: " + error)
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                error: true,
            })


        }
    }


}