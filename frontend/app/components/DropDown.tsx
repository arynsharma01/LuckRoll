"use client"
import {
    Github,
    LogOut,
    Mail,
    User,
    Linkedin,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCash } from "../context/CashContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
  
  export function DropDown() {
    const router = useRouter()
    const [isClient, setIsClient] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [value ,setValue ]= useState<boolean>(true)
  
    useEffect(() => {
      setIsClient(true)
      const token = localStorage.getItem("Authorization")
      setIsAuthenticated(!!token)
    }, [value])
  
    if (!isClient) return null // don't render on server
  
    if (!isAuthenticated) {
      return (
        <div>
          <Button className="  w-24 p-2  bg-blue-500 hover:cursor-pointer text-white rounded-lg  border border-white/20 
        hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300" onClick={() => router.push("/signup")}>
            Sign up
          </Button>
        </div>
      )
    }
    const handleLogout = () => {
      localStorage.removeItem("Authorization")
      setValue(!value)
      router.push('/signin')
    }
    const {user } = useCash()

  
    return (
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="outline"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-w-[90vw] break-words">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{user}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.open("https://github.com/arynsharma01", "_blank")}
          >
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>aryansharma6779@gmail.com</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("https://www.linkedin.com/in/aryan-sharma-36192724b/", "_blank")}
          >
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  