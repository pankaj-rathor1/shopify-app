import { createCustomer } from "~/api/prisma.server"

export default function Customer(){
    createCustomer({
        email: 'pankajr@gmail.com',
        name: 'Pankaj'
    });
    return (<h1>Customer</h1>)
}