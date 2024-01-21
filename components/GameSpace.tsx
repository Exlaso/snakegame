"use client"
import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Button, DialogBody, DialogFooter, DialogHeader, Typography} from "@material-tailwind/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {updateUserScore} from "@/app/actions";

interface typesforGameSpace {
    username: string
    id: string

}

type xcoords = { col: number }
type ycoords = { row: number }
type coords = xcoords & ycoords
type direction = "up" | "down" | "left" | "right"
const isdevicetouchscreen = () => {
    if (typeof window === "undefined") return false
    return ("ontouchstart" in window || navigator.maxTouchPoints > 0)
}
const GameSpace: FunctionComponent<typesforGameSpace> = (props) => {
    const [countdown, setcountdown] = useState<number>(3);
    const [istarted, setistarted] = useState<boolean>(false);
    const [ismodalopen, setIsmodalopen] = useState<boolean>(false);
    const [isgamepaused, setisgamepaused] = useState<boolean>(false);
    const GRID_SIZE: number = 15;
    const Size = `min(${60 / GRID_SIZE}em,${60 / GRID_SIZE}em)`;
    const INTIALSPEED = 100
    const [GAME_SPEED, setGAME_SPEED] = useState<number>(INTIALSPEED);
    const [isgameover, setisgameover] = useState<boolean>(false);
    const [reason, setreason] = useState<string>("");
    const [snake, setsnake] = useState<coords[]>([
        {
            col: 0,
            row: 1
        }, {
            col: 0,
            row: 0
        }
    ]);
    const [score, setscore] = useState<number>(0);
    const [direction, setdirection] = useState<direction>("right");
    const RandomCellGenerator = (): coords => {
        const foodcoords: coords = {
            col: Math.floor(Math.random() * GRID_SIZE),
            row: Math.floor(Math.random() * GRID_SIZE)
        }

        if (snake.some((s) => s.col === foodcoords.col && s.row === foodcoords.row)) {
            return RandomCellGenerator()
        }
        return foodcoords
    }
    const [food, setfood] = useState<coords>({col: 3, row: 9});

    const gameover = async () => {
        window.removeEventListener("keydown", ChangeDirection)
        setisgameover(true)
        setIsmodalopen(true)
        if (props.id !== "") {
            await updateUserScore(props.id,score) ;
        }
    }
    // const crashedintowall = () => {
    //     setreason("You crashed into the wall.")
    //     gameover();
    // }
    const crashedinself = () => {
        setreason("You crashed into yourself.")
        gameover();
    }

    const movethroughwallforcol = (new_x_coord: coords): coords => {
        if (new_x_coord.col < 0) {
            return {col: GRID_SIZE - 1, row: new_x_coord.row}
        } else if (new_x_coord.col >= GRID_SIZE) {
            return {col: 0, row: new_x_coord.row}
        }
        return new_x_coord
    }
    const movethroughwallforrow = (new_x_coord: coords): coords => {
        if (new_x_coord.row < 0) {
            return {col: new_x_coord.col, row: GRID_SIZE - 1}
        } else if (new_x_coord.row >= GRID_SIZE) {
            return {col: new_x_coord.col, row: 0}
        }
        return new_x_coord
    }

    const OrientSnake = (coords: coords[], col: number, row: number) => {

        let new_x_coord: coords = {col: (coords[0].col + col), row: coords[0].row + row}
        new_x_coord = (col !== 0 ? movethroughwallforcol(new_x_coord) : movethroughwallforrow(new_x_coord))
        return [new_x_coord, ...coords.slice(0, coords.length - 1)]


    }
    const MoveSnake = () => {
        if (snake.some((s) => s.col === snake[0].col && s.row === snake[0].row && s !== snake[0])) {
            crashedinself();
        }
        if (direction === "up") setsnake((coords) => OrientSnake(coords, -1, 0))
        if (direction === "down") setsnake((coords) => OrientSnake(coords, 1, 0))
        if (direction === "left") setsnake((coords) => OrientSnake(coords, 0, -1))
        if (direction === "right") setsnake((coords) => OrientSnake(coords, 0, 1))

    }
    const UpdateGameFrames = () => {
        if (!isgamepaused && !isgameover && istarted) {
            if (snake[0].col === food.col && snake[0].row === food.row) {

                setfood(RandomCellGenerator()) // generate new food
                addsnaketail();
                setscore((e) => e + 1) // increment score

            }
            MoveSnake()
        }
    }

    const addsnaketail = () => {
        setsnake((coords) => {
            if (direction === "up") return [...coords, {col: coords[0].col + 1, row: coords[0].row}]
            if (direction === "down") return [...coords, {col: coords[0].col - 1, row: coords[0].row}]
            if (direction === "left") return [...coords, {col: coords[0].col, row: coords[0].row + 1}]
            if (direction === "right") return [...coords, {col: coords[0].col, row: coords[0].row - 1}]
            return coords
        })
    }
    const ChangeDirection = useCallback((e: KeyboardEvent) => {
        if (!isgamepaused) {

            if ((e.key === "ArrowUp" && direction !== "down") || e.key.toLowerCase() === "w" && direction !== "down") setdirection("up")
            else if ((e.key === "ArrowDown" && direction !== "up") || e.key.toLowerCase() === "s" && direction !== "up") setdirection("down")
            else if ((e.key === "ArrowLeft" && direction !== "right") || e.key.toLowerCase() === "a" && direction !== "right") setdirection("left")
            else if ((e.key === "ArrowRight" && direction !== "left") || e.key.toLowerCase() === "d" && direction !== "left") setdirection("right")

        }
        if (e.key === " ") setisgamepaused((e) => !e)

    }, [direction, isgamepaused])

    const RotateSnakeHead = (direction: direction) => {
        switch (direction) {
            case "up":
                return "rotate-[90deg]"
            case "down":
                return "rotate-[270deg]"
            case "left":
                return ""
            case "right":
                return "rotate-[180deg]"
        }
    }
    useEffect(() => {
        setGAME_SPEED(INTIALSPEED - (score * 1.2))

    }, [score])

    useEffect(() => {
            const interval = setInterval(() => {
                setcountdown((e) => e - 1)
            }, 1000);
            setTimeout(() => {
                clearInterval(interval)
                setistarted(true)
            }, 4000);
            return () => clearInterval(interval)
        }
    )
    useEffect(() => {

        const moveSnake = (setInterval(UpdateGameFrames, GAME_SPEED));
        return () => clearInterval(moveSnake);
    });
    useEffect(() => {
        window.addEventListener("keydown", ChangeDirection)
        return () => window.removeEventListener("keydown", ChangeDirection)

    }, [GAME_SPEED, ChangeDirection])

    const GridGenerator = () => {
        const grid = []
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                let className = " border border-gray-500/50 "
                if (food.col === row && food.row === col) {
                    className += " food "
                }
                if (snake.some((s) => s.col === row && s.row === col)) {
                    if (snake[0].col === row && snake[0].row === col) {
                        grid.push(<div key={`${row}-${col}`}
                                       className={`snake rounded-s-full bg-red-400 border ${RotateSnakeHead(direction)}`}></div>)
                        continue
                    }
                    className += " snake rounded-sm "

                }


                grid.push(<div key={`${row}-${col}`} className={className}>
                    {/*{row}{col}*/}

                </div>)
            }

        }
        return grid
    }
    const router = useRouter()


    return (
        <motion.section
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.5}}

            className={`flex flex-col `}>
            {ismodalopen && <motion.div
                animate={{
                    opacity: ismodalopen ? 1 : 0,
                    scale: ismodalopen ? 1 : 0.5,
                    transition: {
                        duration: 0.2
                    }
                }}
                className={"backdrop-brightness-50 flex justify-center items-center h-screen fixed z-[100] inset-0 "}>


                <motion.dialog
                    className={" rounded-2xl p-4"}

                    open={ismodalopen}

                >
                    <DialogHeader>
                        <Typography variant={"h3"}>
                            Game Over! <sup
                            className={"text-red-400 text-sm"}> {props.id === "" && "Score are not recorded"}</sup>
                        </Typography>
                    </DialogHeader>
                    <DialogBody>
                        <Typography variant={"h5"} color={"red"}>{reason}</Typography>
                        <Typography variant={"h5"}> You scored <span className={"text-green-500 font-bold"}>
                    {score} points.
                </span>
                            Click Restart Button to restart the game.</Typography>
                    </DialogBody>
                    <DialogFooter>
                        <Link href={"/LeaderBoard"} className={"m-2"}>
                            <Button>
                                LeaderBoard
                            </Button></Link>
                        <Button
                            variant="gradient"
                            color="green"
                            onClick={() => {
                                setistarted(false);
                                setcountdown(3);
                                const interval = setInterval(() => {
                                    setcountdown((e) => e - 1)
                                }, 1000);
                                setTimeout(() => {
                                    clearInterval(interval)
                                    setistarted(true)
                                }, 4000);
                                setIsmodalopen(false);
                                setisgameover(false);
                                setisgamepaused(false);
                                setdirection("right");
                                setfood(RandomCellGenerator());
                                setscore(0);
                                setsnake([
                                    {
                                        col: 0,
                                        row: 1
                                    }, {
                                        col: 0,
                                        row: 0
                                    }
                                ]);
                                window.addEventListener("keydown", ChangeDirection)

                            }
                            }
                        >
                            <span>Restart</span>
                        </Button>

                    </DialogFooter>
                </motion.dialog>
            </motion.div>
            }
            <div className={"grid grid-cols-[1fr,3fr] items-end  gap-1"}>
                <div>
                    <h1 className={"text-md "}>Score: {score}</h1>
                </div>
                <div className={"flex flex-col items-end"}>
                    <h1 className={"text-xl text-center"}>Logged in as: <span
                        className={"capitalize"}>{props.username} </span></h1>
                    {<Button variant={"filled"} color={"blue-gray"} className={"text-xs w-max"} onClick={() => {
                        router.push("/")
                    }}>{props.id === "" ? "Play with Account" : "Logout"}</Button>}

                </div>

            </div>
            <div className={"relative"}>
                {!istarted &&
                    <div
                        className={"absolute inset-0 backdrop-blur-[2px] z-20 text-[5em] flex justify-center items-center "}>
                        {countdown}

                    </div>}
                <div
                    onClick={() => setisgamepaused((e) => !e)}
                    className={`bg-white/10 my-2 grid aspect-square border-4   ${isgameover ? " border-red-500 " : ""}`}
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE},1fr)`,
                        gridTemplateRows: `repeat(${GRID_SIZE},1fr)`
                    }}
                >

                    {GridGenerator()}
                </div>
            </div>

            {isgamepaused && <h1 className={"text-md md:text-lg text-center text-red-500"}>Game Paused</h1>}
            {isdevicetouchscreen() && <div className={"flex flex-col gap-1"}>
                <Button className={"w-1/2 mx-auto  text-xl"} onClick={() => {
                    if (!isgamepaused) {
                        direction !== "down" && setdirection("up")
                    }
                }}>UP</Button>
                <div className={"flex gap-1"}><Button className={"w-full  text-xl"}
                                                      onClick={() => {
                                                          if (!isgamepaused) {
                                                              direction !== "right" && setdirection("left")
                                                          }
                                                      }}
                >LEFT</Button>
                    <Button className={"w-full  text-xl"}
                            onClick={() => {
                                if (!isgamepaused) {
                                    direction !== "left" && setdirection("right")
                                }
                            }}
                    >RIGHT</Button></div>
                <Button className={"w-1/2 mx-auto  text-xl"}
                        onClick={() => {
                            if (!isgamepaused) {
                                direction !== "up" && setdirection("down")
                            }
                        }}
                >DOWN</Button>

            </div>}


            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.5}}

                className={" text-xl "}>
                {/*<span>*/}
                {/*    Head Location RN: {snake?.at(0)?.col} {snake?.at(0)?.row}*/}
                {/*</span>*/}
                {
                    !isdevicetouchscreen() ? <div>
                        <h3 className={"text-md text-center text-blue-400 my-2"}>Instructions</h3>
                        <ul className={"flex gap-3 flex-col"}>

                            <li>Use arrow keys to move the snake</li>
                            <li>Press spacebar to pause the game & resume the game</li>
                        </ul>
                    </div> : <div>
                        <ul className={"flex gap-3 flex-col"}>
                            <li>Press game-board to pause the game & resume the game</li>
                        </ul>
                    </div>
                }


            </motion.div>
        </motion.section>)
}
export default GameSpace