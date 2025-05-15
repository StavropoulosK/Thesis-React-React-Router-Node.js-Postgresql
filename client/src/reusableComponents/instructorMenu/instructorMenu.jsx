import { UserNav } from "../userMenu/userNav"



export function InstructorMenu(){


    const options=[
    {
        svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"/></svg>,
        text:"Profile",
        linkTo:"profile"
    },
    {
        svg:<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fffefe" fillRule="evenodd" d="M18.5 3.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m-2.25.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M5.376 3.084a.75.75 0 0 1 1.04-.208l5.994 3.996l.642-.578a2.25 2.25 0 0 1 2.91-.084l1.507 1.204a.75.75 0 0 1 .272.47l.449 2.841l3.226 2.151a.75.75 0 1 1-.832 1.248l-3.5-2.333a.75.75 0 0 1-.325-.507l-.27-1.712l-.659.658a.75.75 0 0 1-.946.094l-9.3-6.2a.75.75 0 0 1-.208-1.04m10.501 4.978l-.851-.68a.75.75 0 0 0-.97.027l-.358.322l1.506 1.004zM11 8.934a.75.75 0 0 1 .285 1.022a.75.75 0 0 0 .239.991l.882.588l.565-.565a.75.75 0 0 1 1.06 1.06l-.374.374l1.64 1.172a1.75 1.75 0 0 1 0 2.848l-1.907 1.363l3.762 2.418l2.202-.44a.75.75 0 1 1 .294 1.47l-2.5.5a.75.75 0 0 1-.552-.104l-14-9a.75.75 0 0 1 .81-1.262l8.627 5.545l.032-.024l2.36-1.687a.25.25 0 0 0 0-.406l-2.35-1.68l-1.383-.922a2.25 2.25 0 0 1-.713-2.976A.75.75 0 0 1 11 8.934" color="#fffefe"></path></svg>,
        text:"lessons",
        linkTo:"lessons/studentLessons"
    },
    {
        svg:<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48"><g fill="#fff"><path fillRule="evenodd" d="M12 21a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 0h2v2h-2zm8-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm-18 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm4 0v2h-2v-2zm6-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm2 2h-2v2h2z" clipRule="evenodd"></path><path d="M36 32.5a1 1 0 1 0-2 0v2.914l1.293 1.293a1 1 0 0 0 1.414-1.414L36 34.586z"></path><path fillRule="evenodd" d="M12 7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h10V7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h3a3 3 0 0 1 3 3v16.07A7.001 7.001 0 0 1 35 42a6.99 6.99 0 0 1-5.745-3H9a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h3zm16 28a7 7 0 0 1 6-6.93V18H8v18a1 1 0 0 0 1 1h19.29a7 7 0 0 1-.29-2m12 0a5 5 0 1 1-10 0a5 5 0 0 1 10 0" clipRule="evenodd"></path></g></svg>,
        text:"schedule",
        linkTo:"instructorSchedule"


    },
    {
        svg:<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" fillRule="evenodd" d="M5.5 18a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path><rect width={3} height={7} x={6.5} y={11.5} fill="#fff" rx={0.5}></rect><rect width={3} height={13} x={10.5} y={5.5} fill="#fff" rx={0.5}></rect><rect width={3} height={10} x={14.5} y={8.5} fill="#fff" rx={0.5}></rect></svg>,
        text:"statistics",
        linkTo:"statistics"


    }]


    return(
        <>
            <UserNav options={options}>



            </UserNav>
        </>
    )
}