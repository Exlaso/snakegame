import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

var jwt = require('jsonwebtoken');
export const POST = async (req: NextRequest) => {
    try {

        const body: APIADDCOOKIE = await req.json();
        const a = jwt.sign(body,process.env.JWTKEY)
        cookies().set("token",a);


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