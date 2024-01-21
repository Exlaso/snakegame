import {FunctionComponent} from "react";
import LeaderBoard from "@/components/LeaderBoard";
import {Metadata} from "next";
import {prisma} from "@/prisma/prismaClient";

interface typesforpage {

}

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
    title: "Snake Game | LeaderBoard",
    description: "Snake Game created by Vedant Bhavsar",
    metadataBase: new URL("https://snakegame.exlaso.in"),
    keywords: ["Snake", "Game", "Vedant", "Bhavsar", "Exlaso", "Exlaso.in", "Vedant Bhavsar", "Snake Game", "LeaderBoard", "Leader Board"],
    robots: "index, follow",
    authors: [
        {
            name: "Vedant Bhavsar",
            url: "https://exlaso.in",
        }]
    ,
    openGraph: {
        type: "website",
        url: "https://snakegame.exlaso.in/LeaderBoard",
        title: "Snake Game | LeaderBoard",
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

const page: FunctionComponent<typesforpage> = async () => {

    try {
        await prisma.$connect();
        const leaderBoardData = await prisma.users.findMany({
            orderBy: {
                score: "desc"
            },
        });
        await prisma.$disconnect();
        return <LeaderBoard data={leaderBoardData}>

        </LeaderBoard>

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

        }
        return <LeaderBoard data={[]}/>
    } finally {
        await prisma.$disconnect();
    }


}
export default page