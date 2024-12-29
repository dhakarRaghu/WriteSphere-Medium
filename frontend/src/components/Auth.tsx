import { Link } from "react-router-dom"
export const Auth = ({type}: {type : "signup" | "signin"}) => { 
    return <div className  = " h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div className=" text-3xl font-extrabold">
                create an account
            </div>
            <div className="text-slate-400">
                Already have an account? 
                <Link className="pl-2 underline" to = {"/signin"}>Login</Link>
            </div>
        </div>
    </div>
}