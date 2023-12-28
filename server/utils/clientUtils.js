
import Client from "../models/clientModel.js"

export const findExistingClient = async (name,email,phone) => {
    
    const existingClient = await Client.findOne({
        $or: [
            { name },
            { email },
            { phone }
        ]
    });
    
    return existingClient;
}

export const validateAge = (birthdate) => {
                    // Calculate the age based on the provided birthday
                    const birthDate = new Date(birthdate);
                    const currentDate = new Date();
                    const age = currentDate.getFullYear() - birthDate.getFullYear();
    
                    // Adjust age for leap years
                    if (currentDate.getMonth() < birthDate.getMonth() ||
                        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
}

export const calculateExpirationDate = (validity) => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + validity * 24 * 60 * 60 * 1000);
    return expirationDate;
};

export const updateMembershipStatus = async (client, product, expirationDate) => {
    if (expirationDate <= new Date()) {
        // Pass has expired
        client.membershipStatus = 'inactive';
    } else {
        // Pass is still valid
        client.membershipStatus = 'active';
    }

    // Update the client's product and other relevant fields
    client.product = product;
    await client.save();
};
