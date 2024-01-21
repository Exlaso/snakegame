"use client"
import {FunctionComponent} from "react";
import {Button, Card, Typography} from "@material-tailwind/react";
import {useRouter} from "next/navigation";
import {users} from "@prisma/client";

interface typesforLeaderBoard {
    data: users[]
}


const LeaderBoard: FunctionComponent<typesforLeaderBoard> = (props) => {

    const router = useRouter()
    const TABLE_HEAD = ["Sr no.", "Name", "Score", "Date"];
    const TABLE_ROWS = props.data

    return <>
        <Typography variant={"h3"}>Snake Game</Typography>
        <Typography variant={"h2"}>LeaderBoard</Typography>
        <br/>

        <Card className="h-full w-full overflow-hidden">
            <table className="w-full min-w-max table-fixed text-center ">
                <thead>
                <tr>
                    {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                { TABLE_ROWS.length === 0 ? <tr className="even:bg-blue-gray-50/50 ">
                    <td className="p-4 m-1" colSpan={4}>
                        <Typography variant="h5" color="blue-gray"
                                    className="font-normal text-sm md:text-lg capitalize">
                            No Data
                        </Typography>
                    </td>
                </tr> :
                TABLE_ROWS.map(({userName,scoreTime, score}, index) => (
                    <tr key={userName} className="even:bg-blue-gray-50/50 ">
                        <td className="p-4 m-1">
                            <Typography variant="h5" color="blue-gray"
                                        className="font-normal text-sm md:text-lg capitalize">
                                {index + 1}
                            </Typography>
                        </td>
                        <td className="p-4 m-1">
                            <Typography variant="h5" color="blue-gray"
                                        className="font-normal text-sm md:text-lg capitalize">
                                {userName}
                            </Typography>
                        </td>
                        <td className="p-4 m-1">
                            <Typography variant="h5" color="blue-gray" className="font-normal text-sm md:text-lg">
                                {score}
                            </Typography>
                        </td>
                        <td className="p-4 m-1">
                            <Typography variant="h5" color="blue-gray" className="font-normal text-sm md:text-lg">
                                {new Date(scoreTime).toLocaleString("en-IN", {
                                    hour12: true,
                                    minute: "numeric",
                                    hour: "numeric",
                                    second: undefined,
                                    month: "long",
                                    year: "numeric",
                                    day: "numeric",
                                })}
                            </Typography>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Card>

        <Button className={"text-lg m-5"} color={"blue-gray"} onClick={() => {
            router.push("/");
        }}>
            Play Game
        </Button>

    </>
}
export default LeaderBoard