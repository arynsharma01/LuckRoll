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
export default function Signup() {

    const router = useRouter()
    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")
    const [name, setName] = useState<String>("")
    const [dob, setDob] = useState<Date>()
    const [username, setUsername] = useState<String>("")
    const [loader, setLoader] = useState<Boolean>(false)

    const [usernameWarning, setUsernameWarning] = useState<String>("")
    const [usernameColor, setUsernameColor] = useState<String>("")
    const [response, setResponse] = useState<String>("")
    async function createUser() {
        const body = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            username: username.trim()

        }

        
        try {
            const res = await axios.post(`https://luckroll-production.up.railway.app/luckroll/v1/user/signup`, body)
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

    useEffect(() => {

        let time = setTimeout(async () => {

            try {

                const res = await axios.get(`https://luckroll-production.up.railway.app/luckroll/v1/user/signup/username?username=${username}`)


                const data = res.data as { message: string }
                setUsernameWarning(data.message)
                setUsernameColor("text-green-500")


            }
            catch (e: any) {
                setUsernameWarning(e?.response?.data?.message || "some unknown error")
                setUsernameColor("text-red-500")

            }
        }, 1000);
        return () => { clearTimeout(time) };


    }, [username])
    
    

    


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('Authorization');
            if (token) {
                router.push('/')
            }
        }
    }, []);
    


    return <div className="bg-slate-800 w-full  min-h-screen flex  flex-col items-center justify-center overflow-x-hidden  ">
        <div className=" flex flex-col items-center justify-center md:w-auto w-screen bg-black  gap-1   p-10 min-h-screen mt-1 md:min-h-32 text-white rounded-xl shadow-xl border  shadow-sky-100">
            <div className="text-3xl font-semibold pb-2 ">
                Create Account
            </div>
            <InputForm heading="Full Name " placeholder=" " type="text" onChange={setName} />
            <InputForm heading="Email " placeholder="" type="email" onChange={setEmail} />


            <div className="flex flex-col p-2 justify-between gap-2">

                <div className="text-2xl font-black text-white">
                    Username
                </div>
                <input className="flex p-2 border-2 rounded-xl transition-all duration-200  bg-slate-700 hover:bg-slate-500 focus:bg-slate-600 focus:ring-2 focus:ring-sky-400 min-w-[25vh] text-lg"
                    type="text"
                    required
                    onChange={(e) => {
                        setUsernameWarning("")
                        setUsername(e.target.value)
                    }}

                ></input>


            </div>
            <div className={` ${usernameColor} `}>
                {usernameWarning}
            </div>

            <InputForm heading="Password " placeholder="" type="password" onChange={setPassword} />


            {(loader) ? <Loader /> : <Button text="Signup " onClick={() => {

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
                Existing User ? <Link className="underline text-blue-400 hover:text-blue-500" href="/signin"> Signin</Link>
            </div>

        </div>
    </div>
}
