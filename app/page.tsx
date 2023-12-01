"use client"

import React, {useEffect, useState} from "react";
import {Button, Input, Spinner, Typography} from "@material-tailwind/react";
import {motion} from "framer-motion";
import Link from "next/link";
import {db} from "@/app/utils/airtable";
import {useRouter} from "next/navigation";

const jwt = require('jsonwebtoken');


export default function Home() {
    const router = useRouter();

    const startgame = () => router.push("/Game?isguest=false")
    const PreGame = () => {

        const [name, setname] = useState<string>("");
        const [code, setcode] = useState<string>("");
        const [error, seterror] = useState<string>("");
        const [isloading, setisloading] = useState<boolean>(false);
        const [loggedinname, setloggedinname] = useState<string>("");


        useEffect(() => {
            const cookie = document.cookie.split(";").find(c => c.startsWith("token"))
            console.log({cookie})
            if (cookie) {
                const decoded: APIADDCOOKIE = jwt.decode(cookie.split("=")[1], process.env.JWTKEY)
                console.log({decoded})
                setloggedinname(decoded.UserName)
            }
        }, [])
        const addcookie = async (id: string) => {
            const body: APIADDCOOKIE = {
                id,
                Code: code,
                UserName: name
            }
            await fetch("/api/addcookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
        }
        const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (loggedinname !== "") {
                startgame();
                return
            }
            if (name === "" || code === "") {
                seterror("Please enter your username and code.")
                return
            }
            try {
                setisloading(true)

                db.select(
                    {
                        filterByFormula: `{User Name} = '${name}'`,
                        maxRecords: 1,
                        view: "Grid view"
                    }
                ).firstPage(async (records, fnp) => {
                    if (fnp?.length === 0) {

                        db.create([
                                {
                                    fields: {
                                        "User Name": name,
                                        "code": code,
                                    }

                                }
                            ]
                        ).then(async (res) => {
                            await addcookie(res?.at(0)?.id!)
                            setisloading(false)
                            startgame();
                        })
                    } else {
                        if (fnp?.find(f => f.fields.code === code)) {
                            setisloading(false)
                            await addcookie(fnp?.at(0)?.id || "")
                            startgame();

                            return
                        } else {
                            seterror("Code is incorrect.")
                            setisloading(false)
                            return
                        }
                    }
                })
            } catch
                (e) {
                if (e instanceof Error) {
                    setisloading(false)
                    return
                }
            }


            // startgame()
        }
        return (
            <motion.form
                onSubmit={handlesubmit}
                className={"flex flex-col gap-7 my-5"}
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.5}}

            >
                <Typography variant={"h1"}
                >
                    Welcome to Snake Game
                </Typography>
                <Typography variant={"h4"}
                >
                    By - <Link href={"https://exlaso.in"} className={"underline underline-offset-4"}>
                    Vedant Bhavsar
                </Link>
                </Typography>
                <br/>

                <div className={"grid-cols-1 md:grid-cols-2 gap-3 grid my-4"}>

                    {(loggedinname !== "") ? (
                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center"}>
                            <p className={"text-xl text-center capitalize font-semibold"}>You are logged in
                                as {loggedinname}</p>
                            <Button onClick={() => setloggedinname("")} className={"w-max text-sm"}>Login with other
                                Account</Button>
                        </div>

                    ) : (<>
                            <div>
                                <Input
                                    crossOrigin={""}

                                    value={name}
                                    onChange={(e) => {
                                        setname(e.target.value.toLowerCase().replaceAll(" ", ""))
                                        seterror("")
                                    }}
                                    label="Enter your UserName"
                                    type="text"
                                    color="white"
                                    size={"lg"}
                                    className={"text-xl "}
                                    // placeholder={"@SnakeMaster"}
                                    variant={"outlined"}
                                />
                                <small className={"text-lg my-2 text-gray-600"}>
                                    Enter Your Unique Username for the leaderboard.

                                </small>
                            </div>
                            <div>
                                <Input
                                    crossOrigin={""}

                                    value={code}
                                    onChange={(e) => {
                                        seterror("")
                                        setcode(e.target.value.toLowerCase().replaceAll(" ", ""))
                                    }}
                                    label="Enter your Code"
                                    type="text"
                                    color="white"
                                    size={"lg"}
                                    // placeholder={"123"}
                                    className={"text-xl "}
                                    variant={"outlined"}
                                />

                                <small className={"text-lg my-2 text-gray-600"}>
                                    Enter any code for your authentication.
                                </small>
                            </div>
                        </>
                    )}
                    <p className={"text-lg text-red-500 font-semibold"}>{error}</p>
                </div>
                <Button
                    type={"submit"}
                    disabled={isloading}
                    variant={"filled"} fullWidth={true}
                    className={"text-xl disabled:brightness-50 flex justify-center items-center gap-2"}
                    // onClick={() => startgame()}
                >
                    {isloading && <Spinner/>} Start Game
                </Button>
                <p>

                </p>
                <h3 className={"text-xl text-center  my-2"}>OR</h3>
                <Link href={"/Game?isguest=true"}>

                    <Button
                        type={"button"}
                        disabled={isloading}
                        variant={"filled"} fullWidth={true}
                        className={"text-xl disabled:brightness-50"}
                    > Start as Guest
                    </Button>
                </Link>

                <small className={"text-lg my-2 text-gray-600"}>Please note, scores will not be stored or displayed on
                    the leaderboard.</small>

                <Link href={"/LeaderBoard"}>
                    <Button
                        type={"button"}
                        color={"blue-gray"}
                        disabled={isloading}
                        variant={"filled"} fullWidth={true}
                        className={"text-xl disabled:brightness-50"}
                    > LeaderBoard
                    </Button>
                </Link>
            </motion.form>
        )
    }
    const isdevicetouchscreen = () => {
        if (typeof window === "undefined") return false
        return ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }
    return (
        <>
            <PreGame/>
            <br/>
            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.5}}

                className={" text-xl "}>
                {
                    !isdevicetouchscreen() ? <div>
                            <h1 className={"text-2xl text-center text-red-500 my-2"}>Instructions</h1>
                            <ul className={"flex gap-3 flex-col"}>

                                <li>Use arrow keys to move the snake</li>
                                <li>Press spacebar to pause the game & resume the game</li>
                            </ul>
                        </div> :
                        <div>


                            <h1 className={"text-2xl text-center text-red-500 my-2"}>Instructions</h1>
                            <ul className={"flex gap-3 flex-col"}>
                                <li>Use the buttons on the screen to move the snake</li>
                                <li>Press the pause button to pause the game & resume the game</li>
                            </ul>
                        </div>
                }


            </motion.div>
        </>
    )
}


