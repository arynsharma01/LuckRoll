"use client"
import { useEffect, useState } from "react";
import InputForm from "../components/InputForm";
import Button from "../components/Button";
import axios from "axios";
import Loader from "../components/loader";
import { useRouter } from "next/navigation";
import Link from "next/link";

type responseData = {
    message: string,
    token: string
}
export default function Signin() {

    const router = useRouter()
    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")

    const [loader, setLoader] = useState<Boolean>(false)


    const [response, setResponse] = useState<String>("")
    async function createUser() {
        const body = {

            email: email.trim(),
            password: password.trim()


        }

        try {
            const res = await axios.post('https://luckroll-production.up.railway.app/luckroll/v1/user/signin', body)
            const data = res.data as responseData
            if (res.status === 200) {

                const token: string = data.token
                localStorage.setItem("Authorization", token)

                router.push('/games/luckroll')

            }

        }
        catch (e: any) {

            setResponse(e?.response?.data?.message || "some unknown error")
            setLoader(false)

        }


    }


    if (localStorage.getItem('Authorization')) {
        return <div className="text-black text-3xl text-center flex justify-center items-center">
            Already logined
            <Button onClick={() => {
                localStorage.removeItem('Authorization')
            }} text="Logout" />
        </div>
    }


    return <div className="bg-slate-800 w-full  min-h-screen flex  flex-col items-center justify-center overflow-x-hidden  ">
        <div className=" flex flex-col items-center justify-center md:w-auto w-screen bg-black  gap-1   p-10 min-h-screen mt-1 md:min-h-32 text-white rounded-xl shadow-xl border  shadow-sky-100">

            <div className="text-3xl font-semibold pb-2 ">
                Welcome Back !
            </div>

            <InputForm heading="Email " placeholder="" type="email" onChange={setEmail} />



            <InputForm heading="Password " placeholder="" type="password" onChange={setPassword} />


            {(loader) ? <Loader /> : <Button text="Signin " onClick={() => {

                setLoader(true)
                setResponse('')
                async function test() {
                    await createUser()

                }
                test()

            }} />
            }
            <div className="text-white">
                {response}
            </div>

            <div>
                New User ? <Link className="underline text-blue-400 hover:text-blue-500" href="/signup"> Signup</Link>
            </div>

        </div>
    </div>
}
