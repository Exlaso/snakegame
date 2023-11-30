import {FunctionComponent} from "react";
import GameSpace from "@/components/GameSpace";
import {cookies} from "next/headers";

const jwt = require('jsonwebtoken');

interface typesforpage {
    searchParams: {
        isguest: string

    }
}


export const metadata = {
    title: "Snake Game | Game",
    description: "Snake Game created by Vedant Bhavsar",
    metadataBase: new URL("https://snakegame.exlaso.in"),
    keywords: ["Snake", "Game", "Vedant", "Bhavsar", "Exlaso", "Exlaso.in", "Vedant Bhavsar", "Snake Game", "Game"],
    robots: "index, follow",
    authors: [
        {
            name: "Vedant Bhavsar",
            url: "https://exlaso.in",
        }]
    ,
    openGraph: {
        type: "website",
        url: "https://snakegame.exlaso.in/Game",
        title: "Snake Game | Game",
        description: "Snake Game created by Vedant Bhavsar",
        images: [
            {
                url: "https://exlaso.in/icon.svg",
                width: 512,
                height: 512,
                alt: "Snake Game created by Vedant Bhavsar"
            }
        ],
        siteName: "Snake Game",
        locale: "en_IN",
    }

}

export const dynamic = "force-dynamic"
const page: FunctionComponent<typesforpage> = (props) => {
    let username = "";
    let id = "";

    if (props.searchParams?.isguest !== "true") {
        const cookie = cookies().get("token")?.value;
        if (cookie) {

            const decoded: APIADDCOOKIE = jwt.decode(cookie, process.env.JWTKEY);
            username = decoded.UserName;
            id = decoded.id;
        }


    }
    return <GameSpace username={username} id={id}/>
}
export default page