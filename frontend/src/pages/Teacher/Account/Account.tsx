import { useEffect, useState } from "react"
import { Authentication } from "../../../Auth/Authentication"
import { api } from "../../../process/axios" // Make sure to have axios set up
import { SuccessToast } from "../../../components/Toast/SuccessToast";
import { FailedToast } from "../../../components/Toast/FailedToast";
import { ConfirmModal } from "../../../components/Modal/ConfirmModal";

export const AccountSettings: React.FC = () => {
    const { getUser, getEmail, getID } = Authentication();
    const [edit, setEdit] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(getEmail());
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmEdit, setConfirmEdit] = useState(false)
    const [confirmPass, setConfirmPass] = useState(false)
    const splitUserFullName = () => {
        const fullName = getUser();
        const [last, first, middle] = fullName ? fullName.split(',').map(part => part.trim()) : ["", "", ""];
        setFirstName(first);
        setMiddleName(middle);
        setLastName(last);
    };
    
    useEffect(() => {
        splitUserFullName();
    }, []);


    const handleEditSave = async () => {
        
        try {
            if (!firstName || !middleName || !lastName || !email){
                FailedToast("Please fill up the required fields")
                return;
            } 
            const response = await api.post('/teacher/edit/account', {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                email_address: email,
                teacher_id: getID()
            });
                        
            if (response.status === 200) {
                const user = `${lastName}, ${firstName}, ${middleName}`
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('email', JSON.stringify(email));
                SuccessToast("Account updated!")
                setEdit(false);
                window.location.reload();
               
            } else {
                FailedToast("Acount update failed!")
            }
        } catch (error) {
            FailedToast("Something went wrong!")        
        }
        setConfirmEdit(false)
    };

    const handleChangePasswordSave = async () => {
        
        try {
            if (password.length < 8) {
                FailedToast("Password require to have at least 8 characters")
                return;
            }
            if (!password || !confirmPassword){
                FailedToast("Please fill up the password and confirm password fields")
                return;
            } 
            if (password !== confirmPassword){
                FailedToast("Password don't match!")
                return;
            } 

            const response = await api.post('/teacher/change/password', {
                password: password,
                teacher_id: getID()
            });
                        
            if (response.status === 200) {
                SuccessToast("Success change password!")
                setEdit(false);
               
            } else {
                FailedToast("Change password failed!")               
            }
        } catch (error) {
            FailedToast("Something went wrong!")        
        }
        setConfirmPass(false)
    };

    const openEditConfirmModal = () => { setConfirmEdit(true) }
    const openPassConfirmModal = () => { setConfirmPass(true) }
    return (
        <>
            {confirmPass && <ConfirmModal onClose={() => setConfirmPass(false)} id="" onConfirm={handleChangePasswordSave}/>}
            {confirmEdit && <ConfirmModal onClose={() => setConfirmEdit(false)} id="" onConfirm={handleEditSave}/>}
            <div className='flex flex-col h-full'>
                <div className='bg-white grow'>
                    <div className='flex items-center justify-between border-b-2 border-gray-300 px-8 py-4'>
                        <div>
                            <h1 className='text-2xl font-bold'>Account Settings</h1>
                            <span className="text-xs text-gray-400">This displays every data you need to see.</span>
                        </div>

                        <button
                            type='button'
                            className='p-2 rounded-md text-black flex items-center gap-2 hover:bg-blue-200 border border-gray-300'
                            onClick={() => setEdit(prev => !prev)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Edit Information
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 p-12 ">
                        <h1 className="text-2xl">Account Information</h1>

                        <div className="flex gap-4 flex-col md:flex-row">
                            <label htmlFor="firstname" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                <span className="text-xs font-medium text-gray-700">First Name</span>
                                <input
                                    disabled={!edit}
                                    type="text"
                                    id="firstname"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                />
                            </label>
                            <label htmlFor="middlename" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                <span className="text-xs font-medium text-gray-700">Middle Name</span>
                                <input
                                    disabled={!edit}
                                    type="text"
                                    id="middlename"
                                    value={middleName}
                                    onChange={e => setMiddleName(e.target.value)}
                                    className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                />
                            </label>
                            <label htmlFor="lastname" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                <span className="text-xs font-medium text-gray-700">Last Name</span>
                                <input
                                    disabled={!edit}
                                    type="text"
                                    id="lastname"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                />
                            </label>
                        </div>

                        <div className="block md:flex">
                            <label htmlFor="email" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                <span className="text-xs font-medium text-gray-700">Email Address</span>
                                <input
                                    disabled={!edit}
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                />
                            </label>
                        </div>

                        <button
                            disabled={!edit}
                            type='button'
                            className={`w-full md:w-[8%] justify-center p-2 rounded-md text-white flex items-center gap-2 hover:bg-blue-500 bg-blue-600 ${edit ? '' : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'}`}
                            onClick={openEditConfirmModal}
                        >
                            Save
                        </button>

                        <div className="border-t border-gray-300 my-4"/>
                        
                        <div className="flex gap-4 flex-col">
                            
                            <h1 className="text-2xl">Change Password</h1>                            
                            <div className="flex gap-4 flex-col md:flex-row">
                            
                                <label
                                    htmlFor="password"
                                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                                    >
                                    <span className="text-xs font-medium text-gray-700"> New Password 
                                        {edit && <span className="text-red-600"> * </span>}
                                        </span>

                                    <input
                                        disabled={edit ? false : true}
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder=""
                                        className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label
                                    htmlFor="passwordconfirm"
                                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                                    >
                                    <span className="text-xs font-medium text-gray-700"> Confirm Password 
                                        {edit && <span className="text-red-600"> * </span>}
                                        </span>

                                    <input
                                        disabled={edit ? false : true}
                                        type="password"
                                        id="passwordconfirm"
                                        value={confirmPassword}                                        
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder=""
                                        className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        required
                                    />
                                </label>                                
                            
                            </div>

                            <button
                                disabled={!edit}
                                type='button'
                                className={`w-full md:w-[15%] justify-center p-2 rounded-md text-white flex items-center gap-2 hover:bg-blue-500 bg-blue-600 ${edit ? '' : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'}`}
                                onClick={openPassConfirmModal}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
