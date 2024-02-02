export const createCustomer = async ({name, email}:any) => {
    return await prisma.customer.create({
        data:{
            id: Math.random().toString(32).slice(2),
            name: name,
            email: email
        } as any
    })
}