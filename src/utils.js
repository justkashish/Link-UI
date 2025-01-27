import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'bottom-left'
    })
}

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'bottom-left'
    })
}