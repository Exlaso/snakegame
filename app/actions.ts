"use server"


import {prisma} from "@/prisma/prismaClient";


export const ExistingUser = async (username: string, code: string) => {

    await prisma.$connect()
    const resData = await prisma.users.findUnique({
        where: {
            userName: username
        },
    })
    if (!resData) {
        return prisma.users.create({
            data: {
                userName: username,
                code: code,
                score: 0,
                scoreTime: new Date()
            }
        });
    }
    await prisma.$disconnect()
    return resData
}

export const updateUserScore = async (id: string, score: number) => {
    await prisma.$connect()
    try {

        await prisma.users.update({
            where: {
                id,
                AND: {
                    score: {
                        lt: score
                    }
                }
            },
            data: {
                score: score,
                scoreTime: new Date()
            }
        });
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}