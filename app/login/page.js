"use client"
import { useState } from "react";


function Form() {
    const [value, setValue] = useState({name: "", pass: ""});
    function handleChange(e) {
        setValue({...value, [e.target.name]: e.target.value})
    }
    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: value.name, password: value.pass, id: e.target.id})
        })

        console.log( await res.json());
        if (res.ok) {
            window.location.href = '/admin';
        }
    }
    
    return (
        <div>
            <form id="loginForm" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" name="name" placeholder="Username" value={value.name} onChange={handleChange}/>
                <input type="text" name="pass" placeholder="Password" value={value.pass} onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Form