export const createCustomer = async ({name, email}:any) => {
    return await prisma.customer.create({
        data:{
            id:'1234',
            name: name,
            email: email
        } as any
    })
}