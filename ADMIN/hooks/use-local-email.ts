import { useEffect, useState } from "react"

export function useLocalEmail() {
    const [email, setEmail] = useState('')

    useEffect(() => {
        const storedEmail = localStorage.getItem('picha-kubwa-user-email')
        if (storedEmail) {
            setEmail(storedEmail)
        }
    }, [])

    return email
}