import {FunctionComponent} from "react";
import LeaderBoard from "@/components/LeaderBoard";
import {db} from "@/app/utils/airtable";
import {Metadata} from "next";

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
    const data = new Promise((resolve, reject) => {
        db.select({
            view: "Grid view",
            maxRecords: 20,
            sort: [{field: "Score", direction: "desc"}]
        }).firstPage((err, records) => {
            if (err) {
                reject(err)
            }
            if (!records || !records?.at(0)?.fields) {
                reject("No records")
                return;
            }
            const AIRTABLEDATA: customAIRTABLEDATA = records.map((record) => {
                return {
                    name: record.fields["User Name"],
                    score: record.fields.Score,
                    id: record.fields.User_Unique_id,
                    date: record.fields["Score Time"]
                }

            }) as any;
            resolve(AIRTABLEDATA)
        })
    })


    return <LeaderBoard data={await data as customAIRTABLEDATA[]}>

    </LeaderBoard>
}
export default page