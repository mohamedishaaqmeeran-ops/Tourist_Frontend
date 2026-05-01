// src/services/tourpackageServices.js

import instance from "../instances/instance";
import protectedInstance from "../instances/protectedInstance";

// ===============================
// TOUR PACKAGE SERVICES
// ===============================

export const getAllTourpackages = async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await instance.get(`/tourpackages?${searchParams}`);
    return response.data;
};

export const getTourpackageById = async (id) => {
    const response = await instance.get(`/tourpackages/${id}`);
    return response.data;
};

export const createTourpackage = async (tourpackageData) => {
    const response = await protectedInstance.post(
        "/tourpackages",
        tourpackageData
    );
    return response.data;
};

export const updateTourpackage = async (id, tourpackageData) => {
    const response = await protectedInstance.put(
        `/tourpackages/${id}`,
        tourpackageData
    );
    return response.data;
};

export const deleteTourpackage = async (id) => {
    const response = await protectedInstance.delete(
        `/tourpackages/${id}`
    );
    return response.data;
};

export const getMyTourpackages = async () => {
    const response = await protectedInstance.get(
        "/tourpackages/consultant/tourpackages"
    );
    return response.data;
};

export const getTourpackageBookings = async (tourpackageId) => {
    const response = await protectedInstance.get(
        `/tourpackages/consultant/tourpackages/${tourpackageId}/bookings`
    );
    return response.data;
};

// ===============================
// BOOKING SERVICES
// ===============================

export const bookingForTourpackage = async (
    tourpackageId,
    bookingData
) => {
    const response = await protectedInstance.post(
        `/bookings/${tourpackageId}/book`,
        bookingData
    );
    return response.data;
};

export const updateBookingStatus = async (
    bookingId,
    status,
    notes = ""
) => {
    const response = await protectedInstance.put(
        `/bookings/${bookingId}/status`,
        {
            status,
            notes
        }
    );
    return response.data;
};

export const getMyBookings = async () => {
    const response = await protectedInstance.get("/bookings");
    return response.data;
};

export const getBookingById = async (bookingId) => {
    const response = await protectedInstance.get(
        `/bookings/${bookingId}`
    );
    return response.data;
};