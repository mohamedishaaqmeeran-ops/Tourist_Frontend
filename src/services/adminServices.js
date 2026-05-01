import protectedInstance from "../instances/protectedInstance";

// ================================
// CONSULTANCY SERVICES
// ================================

export const getAllConsultancies = async () => {
    const response = await protectedInstance.get("/consultancies");
    return response.data;
};

export const createConsultancy = async (consultancyData) => {
    const response = await protectedInstance.post(
        "/consultancies",
        consultancyData
    );
    return response.data;
};

export const updateConsultancy = async (id, consultancyData) => {
    const response = await protectedInstance.put(
        `/consultancies/${id}`,
        consultancyData
    );
    return response.data;
};

export const deleteConsultancy = async (id) => {
    const response = await protectedInstance.delete(
        `/consultancies/${id}`
    );
    return response.data;
};

// ================================
// CONSULTANT SERVICES
// ================================

export const createConsultant = async (consultantData) => {
    const response = await protectedInstance.post(
        "/consultancies/consultants",
        consultantData
    );
    return response.data;
};

export const getAllConsultants = async () => {
    const response = await protectedInstance.get(
        "/consultancies/consultants"
    );
    return response.data;
};