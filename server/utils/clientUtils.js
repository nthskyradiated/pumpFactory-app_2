
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
    const expirationDate = new Date(currentDate);

    switch (validity) {
        case '1 day':
            expirationDate.setDate(currentDate.getDate() + 1);
            break;
        case '10 sessions':
            // Implement logic to handle session-based validity
            break;
        case '1 month':
            expirationDate.setMonth(currentDate.getMonth() + 1);
            break;
        case '3 months':
            expirationDate.setMonth(currentDate.getMonth() + 3);
            break;
        case '1 year':
            expirationDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        case 'lifetime':
            // No expiration for lifetime pass
            break;
        default:
            // Handle unsupported validity types
            break;
    }

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